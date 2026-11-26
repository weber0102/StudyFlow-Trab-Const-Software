export const createSubjectController = (service) => ({
  list: (request, response) => response.json(service.list()),
  get: (request, response) => response.json(service.get(request.params.id)),
  create(request, response) {
    const subject = service.create(request.body);
    response.location(`/api/materias/${subject.id}`).status(201).json(subject);
  },
  update: (request, response) => response.json(service.update(request.params.id, request.body)),
  remove(request, response) {
    service.remove(request.params.id);
    response.status(204).end();
  }
});
