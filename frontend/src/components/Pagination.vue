<template>
    <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
        <ul class="pagination shadow-sm">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)" aria-label="Previous">
                    <font-awesome-icon icon="chevron-left" />
                </button>
            </li>
            
            <li 
                v-for="page in visiblePages" 
                :key="page" 
                class="page-item" 
                :class="{ active: currentPage === page, disabled: page === '...' }"
            >
                <button class="page-link" @click="changePage(page)">{{ page }}</button>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="changePage(currentPage + 1)" aria-label="Next">
                    <font-awesome-icon icon="chevron-right" />
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    maxLength: { type: Number, default: 7 } 
});

const emit = defineEmits(['change-page']);

const changePage = (page) => {
    if (page !== '...' && page >= 1 && page <= props.totalPages && page !== props.currentPage) {
        emit('change-page', page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const visiblePages = computed(() => {
    const total = props.totalPages;
    const current = props.currentPage;
    const max = props.maxLength;

    if (total <= max) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [];
    const sideItems = Math.floor((max - 4) / 2); 

    pages.push(1);

    if (current > sideItems + 2) {
        pages.push('...');
    }

    let start = Math.max(2, current - sideItems);
    let end = Math.min(total - 1, current + sideItems);

    if (current <= sideItems + 2) {
        end = max - 2; 
    } else if (current >= total - sideItems - 1) {
        start = total - max + 3;
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - sideItems - 1) {
        pages.push('...');
    }

    pages.push(total);

    return pages;
});
</script>

<style scoped>
.page-link {
    color: #0d6efd;
    cursor: pointer;
}
.page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
    color: white;
}
.page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #fff;
    border-color: #dee2e6;
}
</style>