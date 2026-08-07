const dotenv = require('dotenv');
dotenv.config();

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
    console.error('Failed login, aborting');
    return;
  }

  const token = login.data.data.token;
  const members = await request('/api/members/admin/all', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('members', members.status, members.data);

  if (members.status !== 200 || !Array.isArray(members.data?.data)) {
    console.error('Failed members request');
    return;
  }

  if (members.data.data.length === 0) {
    console.log('no members found');
    return;
  }

  const id = members.data.data[0].id;
  const pdfs = await request(`/api/members/admin/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('pdfs', pdfs.status, pdfs.data);
}

run().catch((err) => {
  console.error('unexpected error', err);
});
