<template>
  <div>
    <h1>Driver Management</h1>
    <p>Total Drivers: {{ drivers.length }}</p>
    <toast-service position="top-right"/>
    <!-- Form to Add a New Driver -->
    <app-input/>

    <h2>Existing Drivers</h2>
    <p v-if="driversWithFuelCards.length > 0">
      Current drivers with fuel cards: 
      <span :class="{ 'fuel-card': driversWithFuelCards }">{{ driversWithFuelCards.join(', ') }}</span>
    </p>

    <!-- PrimeVue DataTable for drivers -->
    <app-table/>
  </div>
</template>


<script setup>
import { computed, onMounted } from 'vue';
import AppInput  from './components/AppInput.vue'
import AppTable from './components/AppTable.vue'
import { useDriverStore } from './stores/driver';

const store = useDriverStore();

const drivers = computed(() => store.drivers);

// Computed property to display drivers with fuel cards
const driversWithFuelCards = computed(() => {
  return drivers.value
    .filter(driver => driver.fuelCard)
    .map(driver => driver.name);
});

// Fetch drivers when the component mounts
onMounted(async () => {
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
