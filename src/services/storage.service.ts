import { supabase } from '@/lib/supabase';

// Compress image on the browser using Canvas API before upload
async function compressImage(file: File, maxWidthPx = 1920, quality = 0.82): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = Math.min(1, maxWidthPx / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
          resolve(compressed.size < file.size ? compressed : file);
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

export const StorageService = {
  async uploadPropertyImage(file: File, propertyId: string) {
    const compressed = await compressImage(file);
    const fileExt = compressed.name.split('.').pop();
    const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { error } = await supabase.storage
      .from('property-images')
      .upload(filePath, compressed, { contentType: compressed.type });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadFile(file: File, bucket: string, folder: string = 'general') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error } = await supabase.storage
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
    const fileName = `${leadId}/${Date.now()}.${fileExt}`;
    const filePath = `leads/${fileName}`;

    const { error } = await supabase.storage
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

  async uploadPersonAvatar(file: File, personId: string) {
    const compressed = await compressImage(file, 500, 0.8); // Smaller for avatars
    const fileExt = compressed.name.split('.').pop();
    const filePath = `avatars/${personId}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('property-images') // Reusing property-images for simplicity or use a generic 'public' bucket
      .upload(filePath, compressed, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  async uploadPersonDocument(file: File, personId: string) {
    const fileExt = file.name.split('.').pop();
    const filePath = `people/${personId}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('client-documents')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('client-documents')
      .getPublicUrl(filePath);

    return {
      name: file.name,
      url: publicUrl,
      doc_type: 'other',
      file_size: file.size,
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

