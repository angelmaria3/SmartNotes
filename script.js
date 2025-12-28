let notes = JSON.parse(localStorage.getItem('smartNotes')) || [];
let editId = null;

// 1. Splash logic
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').classList.add('hidden');
        document.getElementById('home-screen').classList.remove('hidden');
        renderNotes();
    }, 2000);
});

// 2. Editor Functions
function openEditor(id = null) {
    const quickTitle = document.getElementById('quick-title').value;
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('editor-screen').classList.remove('hidden');
    
    if (id) {
        const note = notes.find(n => n.id === id);
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        if(note.image) showPreview(note.image);
        editId = id;
    } else {
        clearEditor();
        document.getElementById('note-title').value = quickTitle;
    }
}

function closeEditor() {
    document.getElementById('editor-screen').classList.add('hidden');
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('quick-title').value = '';
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => showPreview(e.target.result);
        reader.readAsDataURL(input.files[0]);
    }
}

function showPreview(src) {
    const container = document.getElementById('edit-img-preview');
    container.innerHTML = `<img src="${src}">`;
}

function saveNote() {
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const previewImg = document.querySelector('#edit-img-preview img');
    const image = previewImg ? previewImg.src : null;

    if (!title) return alert("Please enter a title");

    if (editId) {
        notes = notes.map(n => n.id === editId ? { ...n, title, content, image } : n);
    } else {
        notes.unshift({ id: Date.now(), title, content, image });
    }

    localStorage.setItem('smartNotes', JSON.stringify(notes));
    closeEditor();
    renderNotes();
}

// 3. Render and Interactions
function renderNotes() {
    const grid = document.getElementById('notes-grid');
    grid.innerHTML = '';

    notes.forEach(note => {
        const box = document.createElement('div');
        box.className = 'note-box';
        
        box.innerHTML = `
            ${note.image ? `<img src="${note.image}" class="box-img-preview">` : '<div class="box-img-preview" style="display:flex;align-items:center;justify-content:center;color:#ccc">No Image</div>'}
            <div class="box-content">
                <h3>${note.title}</h3>
                <p>${note.content.substring(0, 50)}...</p>
            </div>
        `;

        box.ondblclick = () => openEditor(note.id);

        // Long Press Logic
        let pressTimer;
        box.onmousedown = () => {
            pressTimer = window.setTimeout(() => {
                const action = confirm("Select 'OK' to Delete or 'Cancel' to Edit");
                if (action) deleteNote(note.id);
                else openEditor(note.id);
            }, 800);
        };
        box.onmouseup = () => clearTimeout(pressTimer);

        grid.appendChild(box);
    });
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem('smartNotes', JSON.stringify(notes));
    renderNotes();
}

function clearEditor() {
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    document.getElementById('edit-img-preview').innerHTML = '';
    document.getElementById('image-input').value = '';
    editId = null;
}