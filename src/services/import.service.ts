import { PropertiesService } from './properties.service';
import { Property } from '@/types/database';

export const ImportService = {
  async importFromXml(xmlUrl: string, userId: string) {
    try {
      const response = await fetch(xmlUrl);
      const xmlText = await response.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const imoveis = xmlDoc.getElementsByTagName('imovel');
      
      const stats = {
        total: imoveis.length,
        imported: 0,
        skipped: 0,
        errors: 0
      };

      for (let i = 0; i < imoveis.length; i++) {
        try {
          const item = imoveis[i];
          const reference = this.getTagValue(item, 'referencia');
          
          // Verificar se já existe
          const existing = await this.checkIfExists(reference);
          if (existing) {
            stats.skipped++;
            continue;
          }

          const property: Partial<Property> = {
            registered_by_id: userId,
            reference: reference,
            title: this.getTagValue(item, 'titulo'),
            description: this.getTagValue(item, 'descritivo'),
            type: this.getTagValue(item, 'tipo'),
            transaction_type: this.getTagValue(item, 'transacao') === 'V' ? 'sale' : 'rent',
            price: parseFloat(this.getTagValue(item, 'valor')) || 0,
            price_iptu: parseFloat(this.getTagValue(item, 'valor_iptu')) || 0,
            price_condo: parseFloat(this.getTagValue(item, 'valor_condominio')) || 0,
            area_total: parseFloat(this.getTagValue(item, 'area_total')) || 0,
            area_useful: parseFloat(this.getTagValue(item, 'area_util')) || 0,
            rooms: parseInt(this.getTagValue(item, 'quartos')) || 0,
            suites: parseInt(this.getTagValue(item, 'suites')) || 0,
            bathrooms: parseInt(this.getTagValue(item, 'banheiro')) || 0,
            parking_spaces: parseInt(this.getTagValue(item, 'garagem')) || 0,
            address_street: this.getTagValue(item, 'endereco'),
            address_neighborhood: this.getTagValue(item, 'bairro'),
            address_city: this.getTagValue(item, 'cidade'),
            address_state: this.getTagValue(item, 'estado'),
            address_zip_code: this.getTagValue(item, 'cep'),
            latitude: this.getTagValue(item, 'latitude'),
            longitude: this.getTagValue(item, 'longitude'),
            video_url: this.getTagValue(item, 'video'),
            images: this.getImages(item),
            main_image: this.getImages(item)[0] || '',
            metadata: {
              features: this.getFeatures(item)
            },
            status: 'available',
            pattern: 'medium',
            is_highlight: this.getTagValue(item, 'destaque') === '1'
          };

          await PropertiesService.create(property);
          stats.imported++;
        } catch (err) {
          console.error('Erro ao importar imóvel individual:', err);
          stats.errors++;
        }
      }

      return stats;
    } catch (error) {
      console.error('Erro na rotina de importação XML:', error);
      throw error;
    }
  },

  getTagValue(parent: Element, tagName: string): string {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent || '' : '';
  },

  getImages(parent: Element): string[] {
    const fotos = parent.getElementsByTagName('foto');
    const urls: string[] = [];
    for (let i = 0; i < fotos.length; i++) {
      const urlTag = fotos[i].getElementsByTagName('url')[0];
      if (urlTag && urlTag.textContent) {
        urls.push(urlTag.textContent);
      }
    }
    return urls;
  },

  getFeatures(parent: Element): string[] {
    const features: string[] = [];
    const common = parent.getElementsByTagName('area_comum')[0];
    const private_area = parent.getElementsByTagName('area_privativa')[0];
    
    const extractItems = (node: Element) => {
      if (!node) return;
      const items = node.getElementsByTagName('item');
      for (let i = 0; i < items.length; i++) {
        if (items[i].textContent) features.push(items[i].textContent);
      }
    };

    if (common) extractItems(common);
    if (private_area) extractItems(private_area);
    
    return Array.from(new Set(features)); // Remover duplicatas
  },

  async checkIfExists(reference: string): Promise<boolean> {
    if (!reference) return false;
    try {
      const { data } = await PropertiesService.getByReference(reference);
      return !!data;
    } catch {
      return false;
    }
  }
};
