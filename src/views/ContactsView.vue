<script>
import axios from 'axios';

axios
export default {
    name: 'contacts',
    data() {
        return {
            name: '',
            email: '',
            message: '',
            errors: {},
            loading: false,
            success: false,
        }
    },
    methods: {
        submitForm() {
            this.loading = true
            const data = {
                name: this.name,
                email: this.email,
                message: this.message
            }

            this.errors = {}

            axios
            .post('http://127.0.0.1:8000/api/contacts', data)
            .then (response =>{
                /* console.log(response); */
                this.success = response.data.success
                if(!response.data.success){
                    this.errors = response.data.errors
                }else{
                    this.name = '',
                    this.email = '',
                    this.message = ''
                }
                this.loading = false
            })
            .catch(err=>{
                console.log(err);
            })
        }
    }
}
</script>
<template>
    <div class="container-60 m-auto mt-5">
        <h1>Contacts page</h1>

        <div class="alert alert-success" role="alert" v-if="success">
            <strong>Messaggio inviato con successo!</strong> Rispondero' a breve sulla tua mail.
        </div>

        <form @submit.prevent="submitForm()" >


            <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" name="name" id="name" class="form-control" placeholder="Mario Rossi"
                    aria-describedby="nameHelper" v-model="name" >
                <small id="nameHelper" class="text-muted">Type your full name here</small>
                <p v-for="(error,index) in errors.name" :key="`message-error-${index}`" class="text-danger">
                    {{ error }}
                </p>
            </div>

            

            <div class="mb-3">
                <label for="email" class="form-label">email</label>
                <input type="email" name="email" id="email" class="form-control" placeholder="Mario@Rossi.com"
                    aria-describedby="emailHelper" v-model="email">
                <small id="emailHelper" class="text-muted">Type your email here</small>
                <p v-for="(error,index) in errors.email" :key="`message-error-${index}`" class="text-danger">
                    {{ error }}
                </p>
            </div>


            <div class="mb-3">
                <label for="message" class="form-label">Message</label>
                <textarea class="form-control" name="message" id="message" rows="8" v-model="message"></textarea>
                <p v-for="(error,index) in errors.message" :key="`message-error-${index}`" class="text-danger">
                    {{ error }}
                </p>
            </div>


            <button type="submit" class="btn btn-primary" :disabled="loading">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-envelope-paper" viewBox="0 0 16 16">
                    <path
                        d="M4 0a2 2 0 0 0-2 2v1.133l-.941.502A2 2 0 0 0 0 5.4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.4a2 2 0 0 0-1.059-1.765L14 3.133V2a2 2 0 0 0-2-2H4Zm10 4.267.47.25A1 1 0 0 1 15 5.4v.817l-1 .6v-2.55Zm-1 3.15-3.75 2.25L8 8.917l-1.25.75L3 7.417V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v5.417Zm-11-.6-1-.6V5.4a1 1 0 0 1 .53-.882L2 4.267v2.55Zm13 .566v5.734l-4.778-2.867L15 7.383Zm-.035 6.88A1 1 0 0 1 14 15H2a1 1 0 0 1-.965-.738L8 10.083l6.965 4.18ZM1 13.116V7.383l4.778 2.867L1 13.117Z" />
                </svg>
                Send
            </button>



        </form>
    </div>
</template>


<style lang="scss" scoped></style>