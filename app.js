const list = document.querySelector('ul');
const form = document.querySelector('form');

//Add Recipie to DOM Function
const addRecipie = (recipe,id) => {

  let html = `
<li data-id=${id} class="border-bottom p-3">
<div><h3>${recipe.item}<h3></div>
<button class="btn btn-sm btn-danger">Delete</button>
</li>
  `;
  list.innerHTML += html;
}

//Delete recipie from DOM function
const deleteRecipe = (id)=>{
  const recipies = document.querySelectorAll('li');
  recipies.forEach(recipe => {
    if(recipe.getAttribute('data-id') === id){
      recipe.remove();
    }
  })
}


//update recipie in realtime
db.collection('recipes').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    const doc = change.doc;
    if(change.type === 'added'){
      addRecipie(doc.data(),doc.id);
    }else{
      deleteRecipe(doc.id);
    }
  })
})


//Get Recipies
db.collection('recipes').get().then((snapshot) => {
  //console.log(snapshot.docs[0].data())
  snapshot.docs.forEach((doc) => {
    //console.log(doc.id);
    addRecipie(doc.data(),doc.id);
    //console.log(doc.data());
  })
}).catch((err) => {
  console.log(err);
})

//Add Recipie
form.addEventListener('submit',e => {
  e.preventDefault();
  const now = new Date();
  const recipe = {
    item : form.recipe.value,
    created_at : firebase.firestore.Timestamp.fromDate(now)
  };

  db.collection('recipes').add(recipe).then(() => {
    console.log('recipie added successfull');
  }).catch(err => {
    console.log(err);
  });
  form.reset();
})

//Delte Recipes
list.addEventListener('click', e =>{
  if(e.target.tagName === 'BUTTON'){
    const id = e.target.parentElement.getAttribute('data-id')
     db.collection('recipes').doc(id).delete();
  }
})
