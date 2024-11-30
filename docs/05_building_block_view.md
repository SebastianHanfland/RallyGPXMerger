# Building Block View

## Whitebox Overall System

The system consists of a React Frontend and a simple node backend.
The main logic is in the Frontend. The backend only stores the json with CRUD and checks the password also stored in the json as simple form of authorization

### Frontend

React <-> Redux/Store <-> Logic

The redux store is stored in the local storage of the browser, with every update.
When entering the site again, the state is persisted.

Plannings can also be loaded from the server when the respective planning id is set in the URL

### Backend

Simply storing JSONs as files

