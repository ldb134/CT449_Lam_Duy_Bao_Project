<template>
    <div v-if="isVisible" class="modal-backdrop fade show"></div>
    
    <div v-if="isVisible" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title fw-bold">
                        <font-awesome-icon icon="calendar-check" class="me-2" /> Đăng Ký Mượn Sách
                    </h5>
                    <button type="button" class="btn-close btn-close-white" @click="close"></button>
                </div>
                
                <div class="modal-body">
                    <div class="alert alert-info d-flex align-items-center mb-3">
                        <font-awesome-icon icon="book" class="me-3 fs-4" />
                        <div>
                            Bạn đang đăng ký mượn cuốn:<br>
                            <strong class="text-primary">{{ book?.tenSach }}</strong>
                        </div>
                    </div>

                    <form @submit.prevent="submitForm">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Ngày muốn nhận sách</label>
                            <input 
                                type="date" 
                                class="form-control" 
                                v-model="pickupDate" 
                                required
                                :min="minDate" 
                            >
                            <div class="form-text text-info">
                                <font-awesome-icon icon="info-circle" class="me-1"/>
                                Sách sẽ được giữ cho bạn trong <strong>3 ngày</strong> kể từ ngày này (nếu được duyệt sớm).
                            </div>
                        </div>

                        <div class="alert alert-secondary py-2 small">
                            <font-awesome-icon icon="lightbulb" class="me-1 text-warning" />
                            <strong>Mẹo:</strong> Nếu nhân viên chưa kịp duyệt vào ngày bạn chọn, bạn vẫn có thể đến nhận sách trong vòng 48h sau khi có thông báo duyệt.
                        </div>

                        <div class="d-flex justify-content-end gap-2 mt-4">
                            <button type="button" class="btn btn-secondary" @click="close">Hủy</button>
                            <button type="submit" class="btn btn-success fw-bold">
                                <font-awesome-icon icon="paper-plane" class="me-1" /> Gửi Yêu Cầu
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    isVisible: Boolean,
    book: Object
});

const emit = defineEmits(['close', 'confirm']);

const pickupDate = ref('');

const minDate = computed(() => {
    return new Date().toISOString().split('T')[0];
});

watch(() => props.isVisible, (newVal) => {
    if (newVal) {
        pickupDate.value = minDate.value;
    }
});

const close = () => {
    emit('close');
};

const submitForm = () => {
    emit('confirm', pickupDate.value);
};
</script>

<style scoped>
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>