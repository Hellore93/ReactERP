import { createContext, useContext, useState, useCallback } from "react";
import { QueryService } from "../services/QueryService";

const DataStoreContext = createContext(null);

export const DataStoreProvider = ({ children }) => {
  const [entities, setEntities] = useState({});
  const resetStore = () => setEntities({});

  const loadRecords = useCallback(
    async (objectName, { force = false, userId } = {}) => {
      if (!force && entities[objectName]?.initialized) return;

      setEntities((prev) => ({
        ...prev,
        [objectName]: {
          items: prev[objectName]?.items || [],
          picklists: prev[objectName]?.picklists || {},
          initialized: prev[objectName]?.initialized || false,
          loading: true,
          error: null,
        },
      }));

      try {
        let data;
        let picklists = {};
        if (objectName === "Product") {
          data = await QueryService.getAllRecordsByObjectName(objectName);
          const unit = await QueryService.getUnitPicklistValue();
          picklists = { unit };
        } else if (objectName == "WorkDay") {
          if (!userId) {
            throw new Error("Brak userId dla obiektu WorkDay/workingHour");
          }
          data = await QueryService.getWorkingHoursByUserId(userId);
        } else {
          data = await QueryService.getAllRecordsByObjectName(objectName);
        }

        setEntities((prev) => ({
          ...prev,
          [objectName]: {
            ...(prev[objectName] || {}),
            items: data || [],
            picklists,
            initialized: true,
            loading: false,
            error: null,
          },
        }));
      } catch (err) {
        setEntities((prev) => ({
          ...prev,
          [objectName]: {
            ...(prev[objectName] || {}),
            items: prev[objectName]?.items || [],
            initialized: true,
            loading: false,
            error: err,
          },
        }));
      }
    },
    [entities]
  );

  const loadWorkingHourMethod = useCallback(
    async (objectName, userId, opts = {}) => {
      return loadRecords(objectName, { ...opts, userId, force: true });
    },
    [loadRecords]
  );

  const updateRecordInStore = useCallback(async (objectName, record) => {
    try {
      const { data } = await QueryService.updateRecord(record, objectName);
      const updated = data?.[0] ?? record;

      setEntities((prev) => {
        const entity = prev[objectName];
        const newItems = entity.items.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item
        );

        return {
          ...prev,
          [objectName]: { ...entity, items: newItems },
        };
      });

      return updated;
    } catch (err) {
      console.error("updateRecord error", err);
      throw err;
    }
  }, []);

  const insertRecordInStore = useCallback(async (objectName, record) => {
    try {
      const { data } = await QueryService.insertRecord(record, objectName);
      const inserted = data?.[0] ?? record;

      setEntities((prev) => {
        const entity = prev[objectName] || {
          items: [],
          initialized: true,
          loading: false,
          error: null,
        };

        return {
          ...prev,
          [objectName]: {
            ...entity,
            items: [...entity.items, inserted],
          },
        };
      });

      return inserted;
    } catch (err) {
      console.error("insertRecord error", err);
      throw err;
    }
  }, []);

  const deleteRecordInStore = useCallback(async (objectName, record) => {
    try {
      await QueryService.deleteProduct(record, objectName);

      setEntities((prev) => {
        const entity = prev[objectName];
        const newItems = entity.items.filter((item) => item.id !== record.id);

        return {
          ...prev,
          [objectName]: {
            ...entity,
            items: newItems,
          },
        };
      });

      return true;
    } catch (err) {
      console.error("deleteRecord error", err);
      throw err;
    }
  }, []);

  const uploadImageInStore = useCallback(
    async (objectName, file, recordId, storageName) => {
      if (!file || !recordId) return null;

      const url = await QueryService.uploadProductImage(
        file,
        recordId,
        storageName
      );
      return url;
    },
    []
  );

  const value = {
    entities,
    loadRecords,
    loadWorkingHourMethod,
    updateRecordInStore,
    insertRecordInStore,
    deleteRecordInStore,
    uploadImageInStore,
    resetStore
  };

  return (
    <DataStoreContext.Provider value={value}>
      {children}
    </DataStoreContext.Provider>
  );
};

export const useDataStore = () => {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used inside provider");
  return ctx;
};

export const useObjectStore = (objectName) => {
  const {
    entities,
    loadRecords,
    loadWorkingHourMethod,
    updateRecordInStore,
    insertRecordInStore,
    deleteRecordInStore,
    uploadImageInStore,
  } = useDataStore();

  const stateForObject = entities[objectName] || {
    items: [],
    initialized: false,
    loading: false,
    error: null,
  };

  const load = useCallback(
    (opts) => loadRecords(objectName, opts),
    [loadRecords, objectName]
  );

  const loadWorkingHour = useCallback(
    (opts) => loadWorkingHourMethod(objectName, opts),
    [loadWorkingHourMethod, objectName]
  );

  const update = useCallback(
    (record) => updateRecordInStore(objectName, record),
    [updateRecordInStore, objectName]
  );

  const insert = useCallback(
    (record) => insertRecordInStore(objectName, record),
    [insertRecordInStore, objectName]
  );

  const remove = useCallback(
    (record) => deleteRecordInStore(objectName, record),
    [deleteRecordInStore, objectName]
  );

  const uploadImage = useCallback(
    (file, recordId, storageName) =>
      uploadImageInStore(objectName, file, recordId, storageName),
    [uploadImageInStore, objectName]
  );

  return {
    ...stateForObject,
    load,
    loadWorkingHour,
    update,
    insert,
    remove,
    uploadImage,
  };
};
