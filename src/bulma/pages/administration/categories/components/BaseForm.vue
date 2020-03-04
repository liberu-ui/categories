<template>
    <div class="columns is-centered">
        <div class="column is-half is-full-touch">
            <enso-form class="box form-box has-background-light raises-on-hover"
                @submit="$refs.categories.fetch()">
                <template v-slot:parent_id="{ field }">
                    <label class="label">
                        {{ i18n('Parent Category') }}
                    </label>
                    <categories v-model="field.value"
                        ref="categories"/>
                </template>
            </enso-form>
        </div>
    </div>
</template>

<script>
import { EnsoForm } from '@enso-ui/forms/bulma';
import Categories from './Categories.vue';

export default {
    name: 'BaseForm',

    inject: ['i18n'],

    components: { Categories, EnsoForm },
};
</script>
