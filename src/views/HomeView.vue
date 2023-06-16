<script>
export default {
    name: 'home'
}
</script>
<template>
    <div class="container">
        <h1>Home page</h1>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 g-4">
            <div class="col" v-for="project in projects.data">
                <div class="card h-100">
                    <img class="card-img-top" :src="getImagePath(projects.cover_image)" alt="">
                    <div class="card-body">
                        <h3>
                            {{ project.title }}
                        </h3>
                        <p>
                            {{ truncateText(project.content) }}
                        </p>
                        <router-link :to="{ name: 'single-project', params: { 'slug': project.slug } }">Read more</router-link>
                    </div>
                    <div class="card-footer">
                        <span class="badge bg-primary">{{ project.id }}</span>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped></style>