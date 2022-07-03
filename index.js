'use strict'
const inputSearch = document.querySelector('.inputSearch')
const addList = document.querySelector('.addList')

async function getRepos(str) {
   fetch(`https://api.github.com/search/repositories?q=${str}`)
      .then(items => items.json())
      .then(item => {
         if (item.message == 'Not Found') throw new Error('ничего не найдено')
         renderRepo(item.items.splice(0,5))
      })
      .catch(err => {
         document.querySelectorAll('li').forEach(item => item.remove())
         return err
      })
}

function renderRepo(repos) {
   let li = document.querySelectorAll('li')
   
   li.forEach(item => item.remove())
   if (Array.isArray(repos)) {
      repos.slice(0, 5).forEach(item => {
         const li = document.createElement('li')
         li.textContent = item.name
         document.querySelector('ul').appendChild(li)
         li.addEventListener('click', () => {
            addbookmarks(item.name, item.owner.login, item.stargazers_count)
            document.querySelectorAll('li').forEach(item => item.remove())
         })
      })
   }
}

function addbookmarks(name, owner, stars){
   const block = document.createElement('div')
   block.classList.add('block')

   const wrapperBlock = document.createElement('div')
   wrapperBlock.classList.add('wrapperBlock')
   block.appendChild(wrapperBlock)

   const nameSpan = document.createElement('span')
   nameSpan.textContent = `Name: ${name}`
   wrapperBlock.appendChild(nameSpan)
   addList.appendChild(block)

   const ownerSpan = document.createElement('span')
   ownerSpan.textContent = `Owner: ${owner}`
   wrapperBlock.appendChild(ownerSpan)

   const starsSpan = document.createElement('span')
   starsSpan.textContent = `Stars: ${stars}`
   wrapperBlock.appendChild(starsSpan)

   const button = document.createElement('div')
   button.classList.add('close')
   const img = document.createElement('div')
   img.classList.add('imgX')
   button.appendChild(img)
   block.appendChild(button)

   inputSearch.value = ''
   
   const close = addList.querySelectorAll('.close')
   close.forEach(item => {
      item.addEventListener('click',(e)=>removeBookmark(e) )
   })
}

function removeBookmark(e){
   if(e.target.className === 'imgX'){
      (e.target.parentElement).parentElement.remove()
   }
   e.target.parentElement.remove()
}

const delaySearch = debounce(getRepos, 300)

function debounce(f, ms) {
   var _this = this;
   var isCooldown = false;
   return function () {
      if (isCooldown) {
         return;
      }
      f.apply(_this, arguments);
      isCooldown = true;
      setTimeout(function () { return isCooldown = false; }, ms);
   };
}

inputSearch.addEventListener('input', (e) => delaySearch(e.target.value))