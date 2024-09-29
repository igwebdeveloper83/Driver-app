// store.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { collection, getDocs, addDoc, updateDoc, getFirestore, doc } from 'firebase/firestore';

export const useDriverStore = defineStore('driverStore', () => {
  const drivers = ref([]);

  const db = getFirestore()

  // Fetch drivers from Firestore and listen for real-time updates
  

 const fetchDrivers = async () => {
  // Define the 'drivers' collection
  const driversCollection = collection(db, 'drivers');
  
  try {
    // Fetch all documents in the 'drivers' collection
    const querySnapshot = await getDocs(driversCollection);
    
    // Map through the documents to extract their data
    drivers.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log('Fetched drivers:', drivers.value);
    
  } catch (error) {
    console.error('Error fetching drivers:', error);
    
  }
  return drivers.value;
};
  // Add a new driver to Firestore
  const addDriver = async (driverName) => {
    try {
      await addDoc(collection(db, "drivers"), {
        name: driverName,
        fuelCard: false  // Default value, no fuel card initially assigned
      });
      await fetchDrivers()
    } catch (error) {
      console.error("Error adding driver: ", error);
    }
  };

  const updateDriverFuelCard = async (driverId, fuelCardStatus) => {
    try {
      const driverRef = doc(db, "drivers", driverId);
      await updateDoc(driverRef, {
        fuelCard: fuelCardStatus
      });
    } catch (error) {
      console.error("Error updating driver fuel card: ", error);
    }
  };


  return { drivers, addDriver,fetchDrivers, updateDriverFuelCard};
});
