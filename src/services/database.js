import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase'; // Adjust path as needed

const COLLECTIONS = {
  CALCULATIONS: 'calculations'
};

// ===========================================
// FIREBASE CRUD OPERATIONS
// ===========================================

// Add a new document
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

// Get a single document by ID
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        // Convert Firestore Timestamps to ISO strings for consistency
        createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString() || null
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Get all documents with optional ordering and pagination
export const getDocuments = async (collectionName, options = {}) => {
  try {
    const {
      orderByField = null,
      orderDirection = 'desc',
      limitCount = null,
      startAfterDoc = null,
      whereConditions = []
    } = options;

    let q = collection(db, collectionName);

    // Apply where conditions
    whereConditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });

    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    // Apply pagination
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    // Apply limit
    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const documents = [];

    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to ISO strings
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null
      });
    });

    return documents;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

// Get documents with a specific field value
export const getDocumentsByField = async (collectionName, field, value, options = {}) => {
  try {
    const whereConditions = [{ field, operator: '==', value }];
    return await getDocuments(collectionName, {
      ...options,
      whereConditions: [...whereConditions, ...(options.whereConditions || [])]
    });
  } catch (error) {
    console.error('Error getting documents by field:', error);
    throw error;
  }
};

// Get documents within a range
export const getDocumentsInRange = async (collectionName, field, startValue, endValue, options = {}) => {
  try {
    const whereConditions = [
      { field, operator: '>=', startValue },
      { field, operator: '<=', endValue }
    ];
    return await getDocuments(collectionName, {
      ...options,
      whereConditions: [...whereConditions, ...(options.whereConditions || [])]
    });
  } catch (error) {
    console.error('Error getting documents in range:', error);
    throw error;
  }
};

// Get aggregated data (Note: Firestore aggregation is limited, may need client-side calculation)
export const getAggregatedData = async (collectionName, fields) => {
  try {
    const docs = await getDocuments(collectionName);
    
    const aggregation = {
      totalRecords: docs.length
    };

    fields.forEach(field => {
      const values = docs.map(doc => doc[field]).filter(val => val != null && !isNaN(val));
      
      if (values.length > 0) {
        const sum = values.reduce((acc, val) => acc + Number(val), 0);
        aggregation[`avg${field.charAt(0).toUpperCase() + field.slice(1)}`] = sum / values.length;
        aggregation[`max${field.charAt(0).toUpperCase() + field.slice(1)}`] = Math.max(...values);
        aggregation[`min${field.charAt(0).toUpperCase() + field.slice(1)}`] = Math.min(...values);
      }
    });

    return aggregation;
  } catch (error) {
    console.error('Error getting aggregated data:', error);
    throw error;
  }
};

// Check if document exists with specific field value
export const documentExistsByField = async (collectionName, field, value) => {
  try {
    const docs = await getDocumentsByField(collectionName, field, value, { limitCount: 1 });
    return docs.length > 0;
  } catch (error) {
    console.error('Error checking document existence:', error);
    throw error;
  }
};

export { COLLECTIONS };