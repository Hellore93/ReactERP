import { Supabase } from "./CredentialBase";

export const QueryService = {
  getAllRecordsByObjectName: async (objectName) => {
    const { data, error } = await Supabase.from(objectName).select("*");

    if (error) {
      throw new Error("Nie udało się pobrać produktów: " + error.message);
    }
    return data;
  },

  getUnitPicklistValue: async () => {
    const { data, error } = await Supabase.rpc("get_enum_values", {
      enum_name: "Unit",
    });
    if (error) {
      throw new Error("Nie udało się pobrać fieldów: " + error.message);
    }
    return data;
  },

  insertRecord: async (record, objectName) => {
    console.log('insertRecord >>', record);
    const { data, error, status } = await Supabase.from(objectName)
      .insert([record])
      .select();
      console.log('error >>', error);
    return { data };
  },

  updateRecord: async (record, objectName) => {
    const { data, error } = await Supabase.from(objectName)
      .update(record)
      .eq("id", record.id)
      .select();
    return { data };
  },

  deleteProduct: async (record, objectName) => {
    const { data, error, status } = await Supabase.from(objectName)
      .delete()
      .eq("id", record.id);
  },

  uploadProductImage: async (file, productId, storageName) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await Supabase.storage
      .from(storageName)
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: publicUrl } = await Supabase.storage
      .from(storageName)
      .getPublicUrl(filePath);

    return publicUrl.publicUrl;
  },

  getWorkingHoursByUserId: async(userId) => {
    const { data, error } = await Supabase.from("WorkDay")
      .select("*")
      .eq("userId", userId);
    if (error) throw error;
    return data;
  },
};
