const API_BASE = 'http://localhost:3000';

async function loadstaff() {
    const response = await fetch(`${API_BASE}/staffs`);
    const data = await response.json();
    const tableBody = document.getElementById('stafftable');
    tableBody.innerHTML = '';
    data.forEach(staff => {
        tableBody.innerHTML += `
            <tr>
                <td class="border p-2">${staff.sid}</td>
                <td class="border p-2">${staff.name}</td>
                <td class="border p-2">${staff.role}</td>
                <td class="border p-2">${new Date(staff.dateofjoin).toLocaleString()}</td>
            </tr>
        `;
    });
    
}

document.getElementById('addFlightForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('addName').value;
    const role = document.getElementById('addRole').value;
    const dateofjoin = document.getElementById('dateofjoin').value;

    const response = await fetch(`${API_BASE}/staffs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, dateofjoin })
    }); 
    const results = await response.json();
    alert(results.message  || 'Staff added');
    loadstaff();
});

document.getElementById('bookFlightForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const sid = document.getElementById('updateSid').value;
    const name = document.getElementById('updateName').value; 
    const response = await fetch(`${API_BASE}/staffs/${sid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    const results = await response.json();
    alert(results.message || 'Staff updated');
    loadstaff();
});


document.getElementById('deleteStaffForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const sid = document.getElementById('deleteSid').value; 
    const response = await fetch(`${API_BASE}/staffs/${sid}`, {
        method: 'DELETE'
    }); 
    const results = await response.json();
    alert(results.message || 'Staff deleted');
    loadstaff();
});


document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('document', document.getElementById('document').files[0]);

    const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData  
    });
    const results = await response.json();
    alert(results.message || 'File uploaded');
});



async function loadFiles() {
    // Fetch uploaded files from backend
    const response = await fetch(`${API_BASE}/uploads`);
    const files = await response.json();

    const list = document.getElementById('fileList');
    list.innerHTML = '';

    files.forEach(file => {
        const li = document.createElement('li');
        const link = document.createElement('a');

        link.href = `${API_BASE}/download/${file.id}`; // download link
        link.textContent = file.name;
        link.target = '_blank';
        link.className = 'text-blue-600 hover:underline';

        li.appendChild(link);
        list.appendChild(li);
    });
}

// Initial load
loadstaff();


