const SignInForm = {
  template: `
  <div>
      <h2 class="welcomeheaders">Sign In</h2>
      <form @submit.prevent="signIn">
          <div>
              <label for="userId">User Id</label>
              <input type="text" id="userId" v-model="userId" required>
          </div>
          <div>
              <label for="password">Password</label>
              <input type="password" id="password" v-model="password" required>
          </div>
          <button type="submit">Sign In</button>
          <button @click="$emit('change-screen', 'welcome')">Back</button>
      </form>
      <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
  `,
  data() {
      return {
        userId: '',
          password: '',
          errorMessage: ''
      }
  },
  methods: {
      signIn() {
      const credentials = {
        user_id: this.userId,
          password: this.password
      };

      axios.post('/signin', credentials)
          .then(response => {

              console.log('Signed in successfully', response.data);

              this.$emit('change-screen', 'home-page');
              

          })
          .catch(error => {
              if (error.response && error.response.status === 401) {
                  this.errorMessage = 'Invalid user id or password.';
              } else {
                  this.errorMessage = 'An error occurred. Please try again later.';
              }
              console.error('Sign in error', error.response);
          });
      }
  }
};

const SignUpForm = {
  template: `
  <div>
      <h2 class="welcomeheaders">Sign Up</h2>
      <form @submit.prevent="signUp">
          <div>
              <label for="userId">User Id</label>
              <input type="text" id="userId" v-model="userId" required>
          </div>
          <div>
              <label for="username">Username</label>
              <input type="text" id="username" v-model="username" required>
          </div>
          <div>
              <label for="email">Email Address</label>
              <input type="email" id="email" v-model="email" required>
          </div>
          <div>
              <label for="bio">Bio</label>
              <textarea id="bio" v-model="bio"></textarea>
          </div>
          <div>
              <label for="profilePicture">Profile Picture</label>
              <input type="file" id="profilePicture" @change="validateImage">
          </div>
          <button type="submit">Create Account</button>
          <button @click="$emit('change-screen', 'welcome')">Back</button>
      </form>
      <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
  `,
  data() {
      return {
          userId: '',
          username: '',
          email: '',
          bio: '',
          profilePicture: null,
          errorMessage: ''
      }
  },
  methods: {
      signUp() {
      
      if (!this.validateUserId() || !this.validateUsername() || !this.validateEmail() || !this.validateBio()) {
          // If any validation fails, stop the sign-up process
          return;
      }

      let formData = new FormData();
      formData.append('user_id', this.userId);
      formData.append('username', this.username);
      formData.append('email_address', this.email);
      formData.append('bio', this.bio);
      formData.append('profile_picture', this.profilePicture);

      axios.post('/signup', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      }).then(response => {
          console.log(response.data);
          this.$emit('change-screen', 'home-page');

      }).catch(error => {
          this.errorMessage = error.response.data.error || 'An error occurred during sign-up.';
      });
      },
      validateUserId() {
        if (this.userId.length > 25) {
            this.errorMessage = 'User Id cannot be more than 25 characters.';
            return false;
        }
        return true;
    },    
      validateUsername() {
          if (this.username.length > 25) {
              this.errorMessage = 'Username cannot be more than 25 characters.';
              return false;
          }
          return true;
      },
      validateEmail() {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!this.email.match(emailPattern) || this.email.length > 255) {
              this.errorMessage = 'Please provide a valid email address not more than 255 characters.';
              return false;
          }
          return true;
      },
      validateBio() {
          if (this.bio.length > 255) {
              this.errorMessage = 'Bio cannot be more than 255 characters.';
              return false;
          }
          return true;
      },
      validateImage(event) {
          const file = event.target.files[0];
          this.profilePicture = file;
          
          const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

          if (!acceptedTypes.includes(file.type)) {
              this.errorMessage = 'Please select an image file of type PNG, JPG, or JPEG.';
              return;
          }
          
          // Basic validation for file size (let's say the limit is 5MB)
          if (file.size > 5242880) {
              this.errorMessage = 'The image size should be less than 5MB.';
              return;
          }

      }
  }
};

const WelcomeScreen = {
  template: `
  <div class="content">
      <div class="welcomeheaders">Welcome to SocialSound</div>
      <div class="buttons">
          <button @click="$emit('change-screen', 'sign-in')">Sign In</button>
          <button @click="$emit('change-screen', 'sign-up')">Sign Up</button>
      </div>
  </div>
  `
};

const audioPlayView = new Vue();
Vue.component('audio-item', {
  props: ['audio', 'isUserProfilePage'],
  template: `
    <div class="audio-item">
      <button class="username-link" @click="goToUserProfile(audio.user_id)">{{ audio.username }}</button>
      <div class="audio-image" @click="playAudio(audio)">
        <img :src="'static/imagefiles/' + audio.profile_picture" alt="User profile picture">
        <button class="play-btn">{{ isPlaying ? 'Pause' : 'Play' }}</button>
      </div>
      <p class="title">{{ audio.title }}</p>
      <!-- show update and delete audio buttons in user's profile-page only !-->
      <div v-if="isUserProfilePage">
        <button @click="deleteAudio(audio.user_id, audio.audio_id)">Delete</button>
        <button @click="showUpdateAudioForm=!showUpdateAudioForm">Update</button>


        <!-- Update form -->
        <div v-if="showUpdateAudioForm" class="upload-form">
            <form @submit.prevent="updateAudioFile(audio.user_id, audio.audio_id)">
            <div>
                <label for="title">Title</label>
                <input type="text" id="title" v-model="updatedTitle" required>
            </div>
            <div>
                <label for="audioFile">Audio File</label>
                <input type="file" id="audioFile" @change="handleFileChange" accept="audio/*" required> 
            </div> 
            <button type="submit">Update Audio</button>
            </form>
        </div>
        <div v-if="errorMessage">{{ errorMessage }}</div>
      </div>
  `,
  
  data() {
    return {
        isPlaying: false,
        audioTrack: null, // To handle audio track
        showUpdateAudioForm: false,
        audioFile: null,
        errorMessage: '',
        userProfile: null,
        audios: [],
        updatedTitle: '',
      
    };
  },
  methods: {
    playAudio(audio) {
      // Play or pause the audio
      // Emit an event to stop all audios

      var edgecase = false;
      if(this.isPlaying == true){
        edgecase = true;
      }

      audioPlayView.$emit('stop-all-audios');
      const audioFileName = audio.audio_file;
      console.log(audioFileName);
      const audioPath = `./static/audiofiles/${audioFileName}`


      if(!this.audioTrack){
        this.audioTrack = new Audio(audioPath)
      }
      this.audioTrack.addEventListener('ended', () => {
        this.isPlaying = false;
      });

      // Toggle playback state
      if (this.isPlaying) {
        this.audioTrack.pause();
      } else {
        this.audioTrack.play();
      }
    
      // Toggle the value of isPlaying
      this.isPlaying = !this.isPlaying;
      
      if(edgecase){
        this.isPlaying = false;
      }
    
      this.$emit('audio-selected', audio.audio_id, this.isPlaying);
    },
    goToUserProfile(userId){
      this.$emit('change-screen', 'user-profile', userId);
    },

    deleteAudio(userId, audioId){
      console.log(userId);
      console.log(audioId);

      if (confirm("Are you sure you want to DELETE this audio?")) {
        this.$emit('delete-audio', { userId, audioId });
      }
    },
    updateAudioFile(userId, audioId){
      this.$emit('update-audio', { userId, audioId, updatedTitle: this.updatedTitle, audioFile: this.audioFile });
      this.showUpdateAudioForm= false;
      this.updatedTitle = '';
      this.audioFile = null;
      this.errorMessage = '';
    },
    handleFileChange(event) {
      if (event.target.files.length > 0) {
          const file = event.target.files[0];
          const acceptedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
      
          if (!acceptedTypes.includes(file.type)) {
            this.errorMessage = 'Please select an audio file of type MPEG, MP3 or WAV.';
            return;
          }
      
          if (file.size > 5242880) { // 5MB
            this.errorMessage = 'The audio file size should be less than 5MB.';
            return;
          }
      
          this.audioFile = file;
          this.errorMessage = ''; // Clear any previous error message
      }
    }
  },

  mounted(){
      // To stop other audios when an audio is being played
    audioPlayView.$on('stop-all-audios', ()=>{
      if(this.audioTrack && this.isPlaying){
        this.audioTrack.pause()
       // this.isPlaying = false
      }
    });
  }
});

const HomePage = {

    data() {
      return {
        audios: [],
        audioReplies: [], // This will hold the list of audios
        currentAudio: null,
        isPlaying: false,
        //showUploadForm: { show:true, parentAudioId: null},
        showUploadForm: false,
        showReplyForm: {show: false, parentAudioId: null},
        title: '',
        audioFile: null, 
        like_count: 0
      };
    },

  created() {
    // Fetch the audios from the backend
    axios.get('/audios').then(response => {
      this.audios = response.data.audios;
    });

  },

 
  methods: {
    selectAudio(audioId, isPlaying) {
      // Update the currently playing audio and fetch its replies

      this.isPlaying = isPlaying;
      if (isPlaying) {
        this.currentAudio = this.audios.find(audio => audio.audio_id === audioId);
        
        // Fetch replies for the current audio
        axios.get('/audios/' + audioId).then(response => {
          this.audioReplies = response.data.replies ? response.data.replies : [];
        });
      }
    },
    selectAudioReply(audioId, isPlaying) {
      // Update the currently playing audio and fetch its replies
      this.isPlaying = isPlaying;
    },
    signOut() {
      axios.delete('/signout');
      this.$emit('change-screen', 'welcome');
    },
    handleScreenChange(screen, userId) {
      // This method would emit an event to the root instance
      this.$emit('change-screen', screen, userId);
    },
    goToMyProfile() {
      axios.get('/signin').then(response => {
          this.$emit('change-screen', 'user-profile',response.data.user_id);
      }).catch(error => {
          console.error("Not Signed in:", error);
          this.$emit('change-screen', 'welcome');
      });
    },
    handleFileChange(event) {
      if (event.target.files.length > 0) {
          const file = event.target.files[0];
          const acceptedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
      
          if (!acceptedTypes.includes(file.type)) {
            this.errorMessage = 'Please select an audio file of type MPEG, MP3 or WAV.';
            return;
          }
      
          if (file.size > 5242880) { // 5MB
            this.errorMessage = 'The audio file size should be less than 5MB.';
            return;
          }
      
          this.audioFile = file;
          this.errorMessage = ''; // Clear any previous error message
      }
    },
    uploadAudio() {
      if (!this.title || !this.audioFile) {
          this.errorMessage = "Please fill in all fields.";
          return;
        }
      
        if (this.title.length > 255) {
          this.errorMessage = "Title cannot be more than 255 characters.";
          return;
        }
      
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('audio_file', this.audioFile);
        console.log("parent audiod id: "+ this.showReplyForm.parentAudioId);
        // If its ar reply parent audio is is null

        if(this.showReplyForm.show){
          formData.append('parent_audio_id', this.showReplyForm.parentAudioId); 
        }
        axios.get('/signin').then(response => { 
          axios.post('users/' + response.data.user_id, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(() => {
              console.log('Audio uploaded successfully');
              if(this.showReplyForm.show){
                axios.get('/audios/' + this.showReplyForm.parentAudioId).then(response => {
                  this.audioReplies = response.data.replies ? response.data.replies : [];
                });
                this.showReplyForm.show = !this.showReplyForm.show;
              }else{
                axios.get('/audios').then(response => {
                  this.audios = response.data.audios;
                });
              }
              this.showUploadForm=!this.showUploadForm;

            }).catch(error => {
              console.error('Upload error', error);
              this.errorMessage = 'Failed to upload audio. Please try again.';
            });
      }).catch(error => {
          console.error("Not Signed in:", error);
          this.$emit('change-screen', 'welcome');
      });
        
    },
    likeAudio(audioId){
      axios.put(`/audios/${audioId}`, { increment: true })
        .then(response => {
          console.log('Like count updated successfully');
          this.currentAudio.like_count++;
        })
        .catch(error => {
          console.error('Failed to update like count:', error);
        });
    },
    alertMultipleUploads(){
      alert("Trying to upload multiple audio's at once. Please unselect the current upload form!");
    }
  },
  template: `
    <div class="content">
      <header class="header">
        <div class="header-item" @click="signOut">Sign Out</div>
        <div class="header-item" id="logo">SocialSound</div>
        <div class="header-item" @click="goToMyProfile">My Profile</div>
      </header>
      <div class="upload-button">
          <!-- Upload button that shows the form when clicked -->
          <button @click="if(!showReplyForm.show){showUploadForm = !showUploadForm}else{alertMultipleUploads()}" class="upload-circle">+</button>
      </div>
      
      <!-- Upload form -->
      <div v-if="showUploadForm" class="upload-form">
          <form @submit.prevent="uploadAudio">
          <div>
              <label for="title">Title</label>
              <input type="text" id="title" v-model="title" required>
          </div>
          <div>
              <label for="audioFile">Audio File</label>
              <input type="file" id="audioFile" @change="handleFileChange" accept="audio/*" required>
          </div>
          <button type="submit">Upload Audio</button>
          </form>
      </div>

        <!-- Reply form -->
        <div v-if="showReplyForm.show" class="upload-form">
          <h4> Post a reply </h4>
          <form @submit.prevent="uploadAudio">
          <div>
              <label for="title">Reply Title</label>
              <input type="text" id="title" v-model="title" required>
          </div>
          <div>
              <label for="audioFile">Reply Audio File</label>
              <input type="file" id="audioFile" @change="handleFileChange" accept="audio/*" required>
          </div>
          <button type="submit">Upload Audio Reply</button>
          </form>
      </div>

      <div class="audio-list">
       <audio-item v-for="audio in audios" :audio="audio" :isUserProfilePage="false" @audio-selected="selectAudio" @change-screen="handleScreenChange"></audio-item>
      </div>
      <div class="current-audio" v-if="currentAudio">
        <!-- Show the current audio details and controls here -->
        <div class="audio-controls">
          <span style="padding: 20px">{{ currentAudio.title }}</span>
          <button @click="likeAudio(currentAudio.audio_id)">Like</button>
          <span v-model="like_count">{{ currentAudio.like_count }} Likes</span>
          <button @click="if(!showUploadForm){showReplyForm = {show: !showReplyForm.show, parentAudioId: currentAudio.audio_id}}else{alertMultipleUploads()}">Reply</button>
          <button @click="currentAudio = null; audioReplies = [];">Close</button>
          <!-- Add more controls as needed -->
        </div>
        <div class="audio-list">
          <audio-item v-for="audio in audioReplies" :audio="audio" @audio-selected="selectAudioReply" @change-screen="handleScreenChange"></audio-item>
        </div>
      </div>
    </div>
  `
};

const UserProfile = {
  props: ['userId'],
  data() {
    return {
      userProfile: null,
      audios: [],
      audioReplies: [],
      currentAudio: null,
      isPlaying: false,
      signedInUserId: '',
      errorMessage: '',
      audioFile: null
    };
  },
  computed: {
    isMyProfile() {
      return this.userProfile && this.userId === this.signedInUserId;
    },
    isLoaded(){
      return this.userProfile //The User Information will still show without this
      //This just prevents async/promise issues
    }
  },
  created() {
      this.fetchUserProfile(this.userId)
  },
  methods: {
    fetchUserProfile(userId) {
          this.userId = userId;
          axios.get(`/users/${userId}`).then(response => {
          this.userProfile = response.data;
          this.audios = this.userProfile.audios;
          }).catch(error => {
          console.error('Error fetching user profile', error);
          });
          axios.get('/signin').then(response => {
              this.signedInUserId = response.data.user_id;
          }).catch(error => {
              console.error("Not Signed in:", error);
              this.$emit('change-screen', 'welcome');
          });
    },
    selectAudio(audioId, isPlaying) {
      // Update the currently playing audio and fetch its replies
      this.isPlaying = isPlaying;
      if (isPlaying) {
        this.currentAudio = this.audios.find(audio => audio.audio_id === audioId);
        // Fetch replies for the current audio
        axios.get('/audios/' + audioId).then(response => {
          this.audioReplies = response.data.replies ? response.data.replies : [];
        });
      } else {
        this.currentAudio = null;
        this.audioReplies = [];
      }
    },
    signOut() {
      axios.delete('/signout');
      this.$emit('change-screen', 'welcome');
    },
    goToHomePage() {
      this.$emit('change-screen', 'home-page');
    },
    selectAudioReply(audioId, isPlaying) {
      // Update the currently playing audio and fetch its replies
      this.isPlaying = isPlaying;
    },
    handleScreenChange(screen, userId) {
      // This method would emit an event to the root instance
      this.$emit('change-screen', screen, userId);
    },
    goToMyProfile() {
      axios.get('/signin').then(response => {
          this.fetchUserProfile(response.data.user_id);
      }).catch(error => {z
          console.error("Not Signed in:", error);
          this.$emit('change-screen', 'welcome');
      });
    },
    goToUpdateForm() {
      axios.get('/signin').then(response => {
          this.$emit('change-screen', 'update-form',response.data.user_id);
      }).catch(error => {
          console.error("Not Signed in:", error);
          this.$emit('change-screen', 'welcome');
      });
    },
    likeAudio(audioId) {
      // Implementation for liking an audio
    },
    deleteAudioFromUserProfile({ userId, audioId }) {
      console.log(userId);
      console.log(audioId);

      axios.delete(`/users/${userId}/audios/${audioId}`)
      .then(response => {
          console.log(response.data);
          this.fetchUserProfile(userId);

      })
      .catch(error => {
          if (error.response) {
              console.error('Delete audio error:', error.response.data);
              // Display error message to the user
          } else if (error.request) {
              console.error('Delete audio error:', error.request);
          } else {
              console.error('Delete audio error:', error.message);
          }
      })
    },
    updateAudioFromUserProfile({ userId, audioId, updatedTitle, audioFile}){
      console.log('Update audio file')
      console.log(updatedTitle);

      let formData = new FormData();
      formData.append('title', updatedTitle);
      formData.append('audio_file', audioFile);
      axios.put(`/users/${userId}/audios/${audioId}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      }).then(response => {
        console.log(response.data);
        this.fetchUserProfile(userId);
     
        
      }).catch(error => {
          console.error('Update audio error:', error);
          this.errorMessage = 'Failed to update audio. Please try again.';
      })

    },
  },
  template: `
    <div class="content">
      <header class="header">
        <div class="header-item" @click="signOut">Sign Out</div>
        <div class="header-item" id="logo" @click="goToHomePage">SocialSound</div>
        <div class="header-item" v-if="!isMyProfile" @click="goToMyProfile">My Profile</div>
        <div class="header-item" v-if="isMyProfile" @click="goToUpdateForm">Update Information</div>
      </header>
      <div class="user-info" v-if="isLoaded">
        <!-- User's profile picture, bio, and username here -->
        <img class="profilePic" :src="'static/imagefiles/' + userProfile.profile_picture" alt="Profile Picture">
        <h3>Username: {{ userProfile.username }}</h3>
        <p>Bio: {{ userProfile.bio }}</p>
      </div>
      <div class="audio-list">
        <audio-item v-for="audio in audios" :audio="audio" :isUserProfilePage="true" @audio-selected="selectAudio" @delete-audio="deleteAudioFromUserProfile" @update-audio="updateAudioFromUserProfile"></audio-item>
      </div> 
     

      <div class="current-audio" v-if="currentAudio">
        <!-- Show the current audio details and controls here -->
        <div class="audio-controls">
          <span>{{ currentAudio.title }}</span>
          <button @click="likeAudio(currentAudio.audio_id)">Like</button>
          <!-- Add more controls as needed -->
        </div>
        <div class="audio-list">
          <audio-item v-for="audio in audioReplies" :audio="audio" @audio-selected="selectAudioReply" @change-screen="handleScreenChange"></audio-item>
        </div>
      </div>
    </div>
  `
};


const UpdateForm = {
  props: ['userId'],
  template: `
  <div>
      <h2 class="welcomeheaders">Update Information</h2>
      <form @submit.prevent="save">
          <div>
              <label for="username">Username</label>
              <input type="text" id="username" v-model="username" required>
          </div>
          <div>
              <label for="email">Email Address</label>
              <input type="email" id="email" v-model="email" required>
          </div>
          <div>
              <label for="bio">Bio</label>
              <textarea id="bio" v-model="bio"></textarea>
          </div>
          <div>
              <label for="profilePicture">Profile Picture</label>
              <input type="file" id="profilePicture" @change="validateImage" required>
          </div>
          <button type="submit">Save Information</button>
          <button @click="$emit('change-screen', 'user-profile', userId)">Back</button>
      </form>
      <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
  `,
  data() {
      return {
          username: '',
          email: '',
          bio: '',
          profilePicture: null,
          errorMessage: ''
      }
  },
  methods: {
      save() {
          if (!this.validateUsername() || !this.validateEmail() || !this.validateBio()) {
              // If any validation fails, stop the sign-up process
              return;
          }

          let formData = new FormData();
          formData.append('username', this.username);
          formData.append('email_address', this.email);
          formData.append('bio', this.bio);
          formData.append('profile_picture', this.profilePicture);

          axios.put('/users/'+this.userId, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          }).then(response => {
              console.log(response.data);
              this.$emit('change-screen', 'home-page');

          }).catch(error => {
              this.errorMessage = error.response.data.error || 'An error occurred during save.';
          });
      },    
      validateUsername() {
          if (this.username.length > 25) {
              this.errorMessage = 'Username cannot be more than 25 characters.';
              return false;
          }
          return true;
      },
      validateEmail() {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!this.email.match(emailPattern) || this.email.length > 255) {
              this.errorMessage = 'Please provide a valid email address not more than 255 characters.';
              return false;
          }
          return true;
      },
      validateBio() {
          if (this.bio.length > 255) {
              this.errorMessage = 'Bio cannot be more than 255 characters.';
              return false;
          }
          return true;
      },
      validateImage(event) {
          const file = event.target.files[0];
          this.profilePicture = file;
          
          const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

          if (!acceptedTypes.includes(file.type)) {
              this.errorMessage = 'Please select an image file of type PNG, JPG, or JPEG.';
              return;
          }
          
          // Basic validation for file size (let's say the limit is 5MB)
          if (file.size > 5242880) {
              this.errorMessage = 'The image size should be less than 5MB.';
              return;
          }

      },
  },
  
};


new Vue({
  el: '#app',
  data: {
      currentScreen: '',
      viewingUserId: null,
  },
  components: {
      'welcome': WelcomeScreen,
      'sign-in': SignInForm,
      'sign-up': SignUpForm,
      'home-page': HomePage,
      'user-profile': UserProfile,
      'update-form': UpdateForm,
      //'update-audio': UpdateAudio
  },
  created(){
      this.checkSignInStatus();
  },
  methods: {
      changeScreen(screen, viewingUserId = null) {
        console.log('Changing screen to:', screen);

          this.currentScreen = screen;
          this.viewingUserId = viewingUserId;
      },
      checkSignInStatus() {
          // Example HTTP request to check sign-in status
          console.log('success');
          axios.get('/signin')
              .then(response => {
                console.log('success');
                  this.currentScreen = 'home-page';
              })
              .catch(error => {
                console.log('fail');
                  console.error("Not Signed in:", error);
                  this.currentScreen = 'welcome';
              });
      }
  }
});
