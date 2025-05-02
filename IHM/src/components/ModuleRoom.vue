<!-- <script setup>
defineProps({
    msg: {
        type: String,
        required: true
    }
})

</script> -->


<template>
    <div class="room widget wrapper-rect-3x1 ">
        <div class="">
            <h1> {{ moduleRoom.roomName }}</h1>
           
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            moduleRoom: {
                roomName: null,
            },
        };
    },
    methods: {
    },
}
</script>

<style lang="scss" scoped>


</style>