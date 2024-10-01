<template>
  <div>
    <h1>Driver Management</h1>
    <p>Total Drivers: {{ drivers.length }}</p>
    <toast-service position="top-right"/>
    <!-- Form to Add a New Driver -->
    <form @submit.prevent="submitDriver" class="p-mb-3">
      <input v-model="newDriverName" class="p-inputtext p-mr-2" placeholder="Enter new driver name" required />
      <app-button label="Save" icon="pi pi-check" iconPos="right" class="ml-2" type="submit">Add Driver</app-button>
    </form>

    <h2>Existing Drivers</h2>
    <p v-if="driversWithFuelCards.length > 0">
      Current drivers with fuel cards: 
      <span :class="{ 'fuel-card': driversWithFuelCards }">{{ driversWithFuelCards.join(', ') }}</span>
    </p>

    <!-- PrimeVue DataTable for drivers -->
    <app-table :value="sortedDrivers" stripedRows class="p-datatable-sm" tableStyle="min-width: 50rem">
      <!-- Add conditional class to name field based on fuel card status -->
      <app-column field="name" header="Name">
        <template #body="slotProps">
          <span :class="{ 'fuel-card': slotProps.data.fuelCard }">
            {{ slotProps.data.name }}
          </span>
        </template>
      </app-column>

      <app-column header="Fuel Card">
        <template #body="slotProps">
          <select v-model="slotProps.data.fuelCard" @change="updateFuelCard(slotProps.data)" class="p-inputtext">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </select>
        </template>
      </app-column>
    </app-table>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDriverStore } from './stores/driver';
import { useToast } from 'primevue/usetoast';

// Pinia store to manage drivers
const store = useDriverStore();
const drivers = computed(() => store.drivers);

// PrimeVue Toast for notifications
const toast = useToast();

// Computed property to display drivers with fuel cards
const driversWithFuelCards = computed(() => {
  return drivers.value
    .filter(driver => driver.fuelCard)
    .map(driver => driver.name);
});

// Computed property to sort drivers by name
const sortedDrivers = computed(() => {
  return drivers.value.sort((a, b) => a.name.localeCompare(b.name));
});

// Reactive property for new driver input
const newDriverName = ref("");

// Function to submit a new driver
const submitDriver = async () => {
  if (newDriverName.value.trim()) {
    await store.addDriver(newDriverName.value);
    newDriverName.value = "";  // Clear the input field after submission
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'New driver has been added successfully!',
      life: 5000 // Toast duration (5 seconds)
    });
  }
};

// Function to update fuel card status
const updateFuelCard = async (driver) => {
  try {
    // Update the driver's fuel card status in Firestore
    await store.updateDriverFuelCard(driver.id, driver.fuelCard);
    await store.fetchDrivers();  // Refresh drivers after update
    toast.add({
      severity: 'success',
      summary: 'Updated',
      detail: `Fuel card status for ${driver.name} has been updated!`,
      life: 5000
    });
  } catch (error) {
    console.error("Error updating fuel card status: ", error);
  }
};

// Fetch drivers when the component mounts
onMounted(async () => {
  console.log('Component mounted, fetching drivers...');
  await store.fetchDrivers();
});
</script>

<style scoped>
/* Styling for the name field when fuel card is true */
.fuel-card {
  color: red;
  font-weight: bolder;
}

.p-datatable-sm {
  font-size: 14px;
}

.p-mb-3 {
  margin-bottom: 1rem;
}
</style>
