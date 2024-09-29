<template>
  <div>
    <h1>Driver Management</h1>
    <p>Total Drivers: {{ drivers.length }}</p>
    
    <toast-service/>
    <!-- Form to Add a New Driver -->
    <form @submit.prevent="submitDriver">
      <input v-model="newDriverName" placeholder="Enter new driver name" required />
      <button type="submit">Add Driver</button>
    </form>

    <h2>Existing Drivers</h2>
    <p v-if="driversWithFuelCards.length > 0">
      Current drivers with fuel cards: {{ driversWithFuelCards.join(', ') }}
    </p>
    <table v-if="drivers.length > 0">
      <thead>
        <tr>
          <th>Name</th>
          <th>Fuel Card</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="driver in drivers.sort((a, b) => a.name.localeCompare(b.name))" :key="driver.id">          <!-- Corrected name display with style binding -->
          <td :style="{ color: driver.fuelCard ? 'blue' : 'black' }">
            {{ driver.name }}
          </td>
          <td>
            <select v-model="driver.fuelCard" @change="updateFuelCard(driver)">
              <option :value="true">Ja</option>
              <option :value="false">Nein</option>
            </select>
          </td>        </tr>
      </tbody>
    </table>
    <p v-else>No drivers available.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {useDriverStore} from './stores/driver';
import { useToast } from 'primevue/usetoast';
import { onMounted, computed } from 'vue';


// Pinia store to manage drivers
const store = useDriverStore();
const drivers = computed(() => store.drivers);

const toast = useToast();  // Use the PrimeVue Toast service

const driversWithFuelCards = computed(() => {
  return drivers.value
    .filter(driver => driver.fuelCard)
    .map(driver => driver.name);
});
// Reactive property for new driver input
const newDriverName = ref("");

// Function to submit driver form and add a new driver
const submitDriver = () => {
  if (newDriverName.value.trim()) {
    store.addDriver(newDriverName.value);
    newDriverName.value = "";
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'New driver has been added successfully!',
      life: 3000 // Toast duration (3 seconds)
    }); // Clear the input field after submission
  }
};

const updateFuelCard = async (driver) => {
  try {
    // Here you can update the driver's fuelCard status in Firestore
    await store.updateDriverFuelCard(driver.id, driver.fuelCard);
    await store.fetchDrivers();
    toast.add({
      severity: 'success',
      summary: 'Updated',
      detail: `Fuel card status for ${driver.name} has been updated!`,
      life: 3000
    });
  } catch (error) {
    console.error("Error updating fuel card status: ", error);
  }
};

onMounted(async () => {
  console.log('Component mounted, fetching drivers...');
  await store.fetchDrivers();  // Wait for drivers to be fetched
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

form {
  margin-bottom: 20px;
}
</style>
