<template>
	<div class="init">
		<navBar />
		<div class="step-1" v-if="settings.phase===1">
			<form id="username-form" @submit.prevent="handleSubmit">
				<p>
					<label>Votre pseudo</label>
					<input type="text" v-model="settings.username"  name="username" />
				</p>
				<button>Submit</button>
			</form>
		</div>
		<div class="step-2" v-if="settings.phase===2">loading</div>
		<div class="step-3" v-if="settings.phase===3">finito</div>
		<div class="step-4" v-if="settings.phase===4">error</div>


	</div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import { mapState } from 'vuex'

import navBar from '../components/navBar.vue'

export default {
data() {
	return { }
	},
	components: { navBar },
	computed: {
		...mapState(['items', 'categories', 'settings', 'years', 'loadedYears'])
	},
	methods: {
		handleSubmit() {
			console.log('launch init');
			this.$store.dispatch('launchInit')

		}
	}
}

</script>
