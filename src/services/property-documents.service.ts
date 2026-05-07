import { supabase } from '@/lib/supabase';
import { PropertyDocument } from '@/types/database';
import { StorageService } from './storage.service';

export const PropertyDocumentsService = {
  async getByPropertyId(propertyId: string): Promise<PropertyDocument[]> {
    const { data, error } = await supabase
      .from('property_documents')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as PropertyDocument[];
  },

  async upload(propertyId: string, file: File, docType: PropertyDocument['doc_type']): Promise<PropertyDocument> {
    const url = await StorageService.uploadFile(file, 'property-images', `documents/${propertyId}`);

    const { data, error } = await supabase
      .from('property_documents')
      .insert([{
        property_id: propertyId,
        name: file.name,
        url,
        doc_type: docType,
        file_size: file.size,
      }])
      .select()
      .single();

    if (error) throw error;
    return data as PropertyDocument;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('property_documents')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
