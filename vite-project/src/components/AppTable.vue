<template>
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

      <app-column header="Actions">
        <template #body="slotProps">
          <app-button 
            label="Delete driver" 
            icon="pi pi-trash" 
            class="p-button-danger" 
            @click="deleteDriver(slotProps.data)" 
          />
        </template>
      </app-column>
    </app-table>
</template>

<script setup>
import { useDriverStore } from '../stores/driver';
import { useToast } from 'primevue/usetoast';
import { computed } from 'vue'

// Pinia store to manage drivers
const store = useDriverStore();
const drivers = computed(() => store.drivers);

// PrimeVue Toast for notifications
const toast = useToast();

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

// Function to delete a driver
const deleteDriver = async (driver) => {
  try {
    if (confirm(`Are you sure you want to delete ${driver.name}?`)) {
      await store.deleteDriver(driver.id); // Deletes the driver from Firestore
      toast.add({
        severity: 'warn',
        summary: 'Deleted',
        detail: `${driver.name} has been removed from the system.`,
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Error deleting driver:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete the driver.',
      life: 3000,
    });
  }
};

// Computed property to sort drivers by name
const sortedDrivers = computed(() => {
  return drivers.value.sort((a, b) => a.name.localeCompare(b.name));
});

</script>

<style scoped>
.fuel-card {
  color: red;
  font-weight: bolder;
}</style>