<template>
	<router-link
		to="/"
		class="lost"
	>
		<h1>Page introuvable</h1>
	</router-link>
</template>

<script>
// @ is an alias to /src
import navBar from '../components/navBar.vue'

export default {
	name: 'notFound',
	created() {
	}
}
</script>

<style scoped>
.lost {
	display: block;
	background: center / cover no-repeat url(../assets/lost.jpg);
	height: 100vh;
	width: 100vw;
}



@media screen and (max-width:800px){
	.lost {

	background-size: contain;}
}

.lost h1 {
	padding-top: 2rem;
	margin: auto;
	text-align: center;
}
</style>