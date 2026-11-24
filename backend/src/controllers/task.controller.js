export const createTaskController = (service) => ({
  list: (request, response) => response.json(service.list()),
  get: (request, response) => response.json(service.get(request.params.id)),
  create(request, response) {
    const task = service.create(request.body);
    response.location(`/api/tarefas/${task.id}`).status(201).json(task);
  },
  update: (request, response) => response.json(service.update(request.params.id, request.body)),
  remove(request, response) {
    service.remove(request.params.id);
    response.status(204).end();
  }
});
