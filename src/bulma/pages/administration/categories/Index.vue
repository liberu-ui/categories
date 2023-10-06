<template>
    <div class="columns is-centered">
        <div class="column is-half">
            <tree class="box"
                route-group="administration.categories"
                editable/>
        </div>
    </div>
</template>

<script>
import Tree from '@liberu-ui/orderable-trees/bulma';

export default {
    name: 'Index',

    components: { Tree },
};
</script>
