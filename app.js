// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
// input
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
// grocery container
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement = undefined;
let editFlag = false;
let editID = '';

// ****** FUNCTIONS **********
// Ajouter un item
const addItem = (e) => {
	e.preventDefault();
	const value = grocery.value;
	const id = new Date().getTime().toString();
	if (value && !editFlag){
		// nouvel item
		createListItem(id, value);
		// message d'alerte
		displayAlert('Item added to the list', 'success');
		// show container
		container.classList.add('show-container');
		// add to localStorage
		addToLocalStorage(id, value);
		// reset input and focus
		setBackToDefault();
	} else if (value && editFlag){
		// édition d'un item
		/* Tout bête, nous modifions la valeur de l'élément en cours
		d'édition par la valeur de l'input au moment de l'envoi
		du formulaire */
		editElement.innerHTML = value;
		displayAlert('Value changed', 'success');
		// save to localStorage
		editLocalStorage(editID, value);
		// reset
		setBackToDefault();
	} else {
		displayAlert('Please enter value', 'danger');
	}
};

// Edit item
const editItem = (e) => {
	const groceryParent = e.currentTarget.parentElement.parentElement;
	// e.currentTarget.parentElement => btn-container, il nous faut
	// le paragraphe au même niveau => siblings
	editElement = e.currentTarget.parentElement.previousElementSibling;
	// set form value
	grocery.value = editElement.innerHTML;
	// edit mode
	editFlag = true;
	// edit ID
	editID = groceryParent.dataset.id;
	// texte dans submit
	submitBtn.textContent = 'Edit';
	// Submit form => 2nd else if ,-)
};

// Delete item
const deleteItem = (e) => {
	const groceryParent = e.currentTarget.parentElement.parentElement;
	list.removeChild(groceryParent);
	// hide container ?
	if (list.children.length === 0){
		container.classList.remove('show-container');
	}
	displayAlert('Item removed', 'danger');
	setBackToDefault();
	// remove from localStorage
	const id = groceryParent.dataset.id;
	removeFromLocalStorage(id);
};

// Reset de l'input
const setBackToDefault = () => {
	grocery.value = '';
	editFlag = false;
	editID = '';
	submitBtn.textContent = 'Add';
	grocery.focus();
};

// Messages d'alerte
const displayAlert = (text, action) => {
	alert.textContent = text;
	alert.classList.add(`alert-${ action }`);
	setTimeout(() => {
		alert.textContent = '';
		alert.classList.remove(`alert-${ action }`);
	},1000);
};

// Clear all items
const clearAllItems = () => {
	const items = document.querySelectorAll('.grocery-item');
	if (items.length > 0){
		items.forEach((item) => {
			// remove from parent container => list
			list.removeChild(item);
		});
		// hide container
		container.classList.remove('show-container');
		// alert
		displayAlert('Empty list', 'danger');
		// back to default
		/* si l'utilisateur clique sur le bouton d'édition, puis
		change d'avis et décide de tout vider, il faut alors
		faire un reset ,-) */
		setBackToDefault();
		// remove from localStorage
		localStorage.removeItem('grocerybudJS');
	}
};

// Création d'une nouvelle tâche
const createListItem = (id, value) => {
	const element = document.createElement('article');
	element.classList.add('grocery-item');
	// création d'un attribut data-
	const attr = document.createAttribute('data-id');
	attr.value = id;
	element.setAttributeNode(attr);
	element.innerHTML = `<p class="title">${ value }</p>
		<div class="btn-container">
			<button type="button" class="edit-btn">
				<i class="fas fa-edit"></i>
			</button>
			<button type="button" class="delete-btn">
				<i class="fas fa-trash"></i>
			</button>
		</div>`;
	// edit and delete btn event listener, comme
	// en mode objet avec jQuery ,-)
	const deleteBtn = element.querySelector('.delete-btn');
	deleteBtn.addEventListener('click', deleteItem);
	const editBtn =	element.querySelector('.edit-btn');
	editBtn.addEventListener('click', editItem);
	// append to list
	list.appendChild(element);
};

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener('submit', addItem);
// clear all items
clearBtn.addEventListener('click', clearAllItems);

// ****** LOCAL STORAGE **********
// Sauvegarde localStorage
const addToLocalStorage = (id, value) => {
	// en ES6 { id, value } ,-)
	const grocery = { id:id, value:value };
	// la liste existe ? oui nous la récupérons, sinon empty array
	let items = getLocalStorage();
	// ajout de l'item
	items.push(grocery);
	// sauvegarde de toute la liste
	localStorage.setItem('grocerybudJS', JSON.stringify(items));
};
// Supprimer un article du localStorage
const removeFromLocalStorage = (id) => {
	// chargement de la liste
	let items = getLocalStorage();
	// remove from items
	items = items.filter((item) => {
		return item.id !== id;
	});
	// sauvegarde de toute la liste
	localStorage.setItem('grocerybudJS', JSON.stringify(items));
};
// MAJ d'un item
const editLocalStorage = (id, value) => {
	// la liste
	let items = getLocalStorage();
	// remplacement
	items.forEach((item) => {
		if (item.id === id){
			item.value = value
		}
	});
	// sauvegarde de toute la liste
	localStorage.setItem('grocerybudJS', JSON.stringify(items));
};
// Obtenir la sauvegarde
const getLocalStorage = () => {
	return localStorage.getItem('grocerybudJS') ? JSON.parse(localStorage.getItem('grocerybudJS')) : [];
};

// ****** SETUP ITEMS **********
window.addEventListener('DOMContentLoaded', () => {
	// chargement de la liste ou []
	const items = getLocalStorage();
	if (items.length > 0){
		items.forEach((item) => {
			createListItem(item.id, item.value);
		});
	}
	// afficher le container
	container.classList.add('show-container');
});