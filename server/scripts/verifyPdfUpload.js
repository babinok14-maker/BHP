const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');

const baseUrl = 'http://localhost:5001';

async function request(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, options);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }
  return { status: res.status, data };
}

async function run() {
  const login = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nati@gmail.com', password: 'nati@123!' }),
  });

  console.log('login', login.status, login.data);
  if (login.status !== 200 || !login.data?.data?.token) {
    console.error('Login failed');
    return;
  }

  const token = login.data.data.token;
  const members = await request('/api/members/admin/all', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('members', members.status, members.data);
  if (members.status !== 200 || !Array.isArray(members.data?.data)) {
    console.error('Members request failed');
    return;
  }

  if (members.data.data.length === 0) {
    console.log('No members found');
    return;
  }

  const memberId = members.data.data[0].id;
  console.log('Using member', memberId);

  const fileBuffer = fs.readFileSync('upload-test.pdf');
  const formData = new FormData();
  formData.set('pdf', new Blob([fileBuffer]), 'upload-test.pdf');

  const uploadRes = await fetch(`${baseUrl}/api/members/admin/${memberId}/pdf`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const uploadText = await uploadRes.text();
  let uploadData;
  try {
    uploadData = JSON.parse(uploadText);
  } catch (_) {
    uploadData = uploadText;
  }
  console.log('upload', uploadRes.status, uploadData);

  const pdfs = await request(`/api/members/admin/${memberId}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('pdfs', pdfs.status, pdfs.data);
}

run().catch((err) => {
  console.error('unexpected error', err);
});