<template>
    <div class="columns is-centered">
        <div class="column is-half">
            <category-tree class="box"
                editable/>
        </div>
    </div>
</template>

<script>
import CategoryTree from '../../../components/CategoryTree.vue';

export default {
    name: 'Index',

    components: { CategoryTree },
};
</script>
