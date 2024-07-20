function generate(query, variables){
  // Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible
  
  
  // Define the config we'll need for our Api request
  var url = 'https://graphql.anilist.co',
      options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              query: query,
              variables: variables
          })
      };

  // Make the HTTP Api request
  return fetch(url, options).then(handleResponse)
                     .then(data => {x = data; console.log(data); return data})
                     .catch(handleError);
  
}
function handleResponse(response) {
      return response.json().then(function (json) {
          return response.ok ? json : Promise.reject(json);
      });
}
  
function handleError(error) {
      alert('Error, check console');
      console.error(error);
}

function restartGame(){
  counter = 0;
  document.getElementById('id1').disabled = false;
  document.getElementById('id2').disabled = false;
  document.getElementById("id1").value = "";
  document.getElementById("id2").value = "";
  console.log("RESTARTED")
  document.getElementById("cover").replaceChildren()
  document.getElementById("recommendations").replaceChildren()
  document.getElementById('target').remove()
}

async function randomAnime(id){
    var query = `
    query ($id: Int) {
        Media(id: $id){
          title {
            romaji
            english
            native
            userPreferred
          }
          coverImage {
            extraLarge
            large
            medium
            color
          }
          bannerImage
          recommendations(sort: RATING_DESC) {
            edges {
              node {
                id
                rating
                mediaRecommendation {
                  coverImage {
                      extraLarge
                      large
                      medium
                      color
                  }    
                  id
                  title {
                    romaji
                    english
                    native
                    userPreferred
                  }
                }
              }
            }
          }
        }
      }
    `
    if(id==undefined){
        
        idArray = idArray1000
        nameInput = document.getElementById("username")
        if (nameInput && nameInput.value) {
          idArray = await getUserList(nameInput.value)
        }
        
        input1 = document.getElementById("id1")
        if (input1 && input1.value) {
          console.log("value had")
        }
        else{
          input1.value = idArray[Math.floor(Math.random() * idArray.length)];

        }
        input2 = document.getElementById("id2")
        if (input2 && input2.value) {
          console.log("value 2 had")
        }
        else{
          randomId2 = idArray[Math.floor(Math.random() * idArray.length)]
          variables = {
            'id': randomId2
          }
          response = await generate(query, variables)
          input2.value = randomId2
          targetTitle = document.createElement('span')
          targetTitle.setAttribute('id', 'target')
          targetTitle.textContent = 'Target Anime: ' + response['data']['Media']['title']['romaji'];
          document.getElementById('inputs').appendChild(targetTitle)
          

        }
        id = parseInt(input1.value)
        document.getElementById('id1').disabled = true;
        document.getElementById('id2').disabled = true;
    }
    else{
      counter++
      if(id==document.getElementById("id2").value){
        document.getElementById('id1').disabled = false;
        document.getElementById('id2').disabled = false;
        console.log("you winner")
        document.getElementById("cover").replaceChildren()
        this.win = document.createElement("div");
        this.win.textContent = "winner winner: took " + counter + ' moves'
        counter = 0
        document.getElementById("cover").appendChild(this.win)
        document.getElementById("recommendations").replaceChildren()
        document.getElementById('target').remove()
        return;
      }
    }
    
    
  
  
    variables = {
        'id': id
    }
    response = await generate(query, variables)
    data = response['data']['Media']
    console.log(response)
    var imageUrl = data['coverImage']['large']
    var coverImage = document.getElementById('cover')
    this.img = document.createElement("img");
    this.img.src = imageUrl;
    coverImage.replaceChildren()
    coverImage.appendChild(this.img)
    this.title = document.createElement("h1");
    this.title.textContent = data['title']['romaji']
    coverImage.appendChild(this.title)
    recommendations = data['recommendations']['edges']
    document.getElementById("recommendations").replaceChildren()
    for(var i = 0;i<recommendations.length;i++){
        let img = document.createElement("button");
        if(recommendations[i]['node']['mediaRecommendation']==null){
          continue;
        }
        let id = recommendations[i]['node']['mediaRecommendation']['id']
        img.setAttribute('id', id)
        img.innerHTML = '<img src=' + recommendations[i]['node']['mediaRecommendation']['coverImage']['medium'] + ' />';
        //img.src = recommendations[i]['node']['mediaRecommendation']['coverImage']['medium']
        console.log(img.getAttribute('id'))
        img.onclick= function() {console.log(img);randomAnime(img.getAttribute('id'))}
        let title = document.createElement("div")
        title.textContent = recommendations[i]['node']['mediaRecommendation']['title']['romaji'] + ': ' + recommendations[i]['node']['rating']
        let compartment = document.createElement("div")
        compartment.appendChild(img)
        compartment.appendChild(title)
        compartment.className += "recommendationButton"
        document.getElementById("recommendations").appendChild(compartment);
    }
    
}

var counter = 0;

async function getUserList(username){
  var query = `
  query ($name: String) {
    MediaListCollection (userName: $name, type: ANIME) {
      lists {
        entries {
          mediaId
        }
      }
    }
  }
  `
  variables = {
      'name': username
  }
  allUserAnime = await generate(query, variables)
  allUserAnime = allUserAnime['data']
  userList = []
  console.log(allUserAnime)
  for(let i = 0;i<allUserAnime['MediaListCollection']['lists'][0]['entries'].length;i++){
    userList.push(allUserAnime['MediaListCollection']['lists'][0]['entries'][i]['mediaId'])
  }
  return userList
}

