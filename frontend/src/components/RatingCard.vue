<script setup lang="ts">
import { defineProps } from 'vue'
import type { Rating } from '@/types'

const props = defineProps<{
  rating: Rating
}>()

const getThumbsIconClass = (feedback: boolean) => {
  return feedback ? 'bi-hand-thumbs-up' : 'bi-hand-thumbs-down'
}

const getButtonClass = (feedback: boolean) => {
  return feedback ? 'btn-success' : 'btn-danger'
}
</script>

<template>
  <div class="card mb-3 d-flex flex-row justify-content-between align-items-center">
    <div class="card-body">
      <p class="card-text">{{ props.rating.users_permissions_user.username }}</p>
      <p class="card-text">
        <small class="text-muted">{{ props.rating.Corpo }}</small>
      </p>
    </div>
    <div class="thumbs-icon">
      <button type="button" :class="`btn ${getButtonClass(props.rating.Feedback)} me-3 no-cursor`">
        <i :class="`bi ${getThumbsIconClass(props.rating.Feedback)} fs-2`"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.thumbs-icon {
  margin-left: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem; /* Adjust the size as needed */
  height: 3rem; /* Adjust the size as needed */
  cursor: default; /* Ensure the cursor does not change */
}

/* Disable hover effect */
.btn-success:hover {
  background-color: #198754; /* Default success background color */
  border-color: #198754; /* Default success border color */
  color: #fff; /* Default text color */
}

.btn-danger:hover {
  background-color: #dc3545; /* Default danger background color */
  border-color: #dc3545; /* Default danger border color */
  color: #fff; /* Default text color */
}

.no-cursor {
  cursor: default;
}
</style>