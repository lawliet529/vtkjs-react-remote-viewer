## Build instructions

### Building frontend

```bash
npm install
npm run build
```

### Running server

Create virtual environment if necessary

```bash
python -m venv venv
source venv/bin/activate
```

Install dependencies

```bash
pip install vtk[web]
```

Start server

```bash
python server/vtkpython/vtkw-server.py --port 1234 --content build --debug
```
