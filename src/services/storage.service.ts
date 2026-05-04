import { supabase } from '@/lib/supabase';

export const StorageService = {
  async uploadPropertyImage(file: File, propertyId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${propertyId}/${Math.random()}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadFile(file: File, bucket: string, folder: string = 'general') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadLeadDocument(file: File, leadId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${leadId}/${Math.random()}.${fileExt}`;
    const filePath = `leads/${fileName}`;

    const { data, error } = await supabase.storage
      .from('client-documents')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('client-documents')
      .getPublicUrl(filePath);

    return {
      name: file.name,
      url: publicUrl,
      type: file.type,
      created_at: new Date().toISOString()
    };
  },

  async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }
};
