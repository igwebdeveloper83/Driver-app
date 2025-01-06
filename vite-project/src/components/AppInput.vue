<!-- DriverForm.vue -->
<template>
    <form @submit.prevent="submitDriver" class="p-mb-3">
      <input
        v-model="newDriverName"
        class="p-inputtext p-mr-2"
        placeholder="Enter new driver name"
        required
      />
      <app-button
        label="Save"
        icon="pi pi-check"
        iconPos="right"
        class="ml-2"
        type="submit"
      >
        Add Driver
      </app-button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useToast } from 'primevue/usetoast';
  import { useDriverStore } from '../stores/driver';
  
  // Setup store and toast
  const store = useDriverStore();
  const toast = useToast();
  
  // Reactive property for new driver input
  const newDriverName = ref("");
  
  // Submit function
  const submitDriver = () => {
    if (newDriverName.value.trim()) {
      store.addDriver(newDriverName.value);
      newDriverName.value = ""; // Clear the input field
  
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'New driver has been added successfully!',
        life: 3000 // Toast duration (3 seconds)
      });
    }
  };
  </script>
  