<script>
export default {
    name: 'AppFooter'
}
</script>
<template>
    <footer>
        <div class=" footer pb-3 pt-3">
            <div class="container-60 m-auto d-flex">
                <div class="w-100 d-flex justify-content-between align-items-center ">
                    <router-link class="nav-link active text-black" :to="{ 'name': 'home' }" aria-current="page">Home </router-link>
                    <router-link class="nav-link text-black" :to="{ 'name': 'projects' }" aria-current="page">Projects </router-link>
                    <router-link class="nav-link text-black" :to="{ 'name': 'about' }" aria-current="page">About </router-link>
                    <router-link class="nav-link text-black" :to="{ 'name': 'contacts' }" aria-current="page">Contacts </router-link>
                </div>
                <div class="w-100 d-flex justify-content-center">         
                    <div class="me-5">Find me on</div>
                    <div class="d-flex justify-content-between gap-3"> 
                        <div><i class="fa-brands fa-square-twitter fa-2xl"></i></div>
                        <div><i class="fa-brands fa-square-facebook fa-2xl"></i></div>
                        <div><i class="fa-brands fa-linkedin fa-2xl"></i></div>
                        <div><i class="fa-brands fa-square-github fa-2xl"></i></div>
                    </div>               
                </div>
            </div>
        </div>
    </footer>
</template>


<style lang="sass" scoped>

</style>