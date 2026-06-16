const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const resp = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data.message || "Erro na requisição");
  }
  return data;
}

export const planosApi = {
  listar: (filtros = {}) => {
    const qs = new URLSearchParams(filtros).toString();
    return request(`/api/planos${qs ? `?${qs}` : ""}`);
  },
  cadastrar: (plano) =>
    request("/api/planos", { method: "POST", body: JSON.stringify(plano) }),
  alterarStatus: (id, status) =>
    request(`/api/planos/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

export const vinculoApi = {
  buscarPaciente: (pacienteId) => request(`/api/pacientes/${pacienteId}`),
  vincular: (pacienteId, planoId) =>
    request(`/api/pacientes/${pacienteId}/plano`, {
      method: "POST",
      body: JSON.stringify({ plano_id: planoId }),
    }),
  atualizar: (pacienteId, planoId) =>
    request(`/api/pacientes/${pacienteId}/plano`, {
      method: "PUT",
      body: JSON.stringify({ plano_id: planoId }),
    }),
  consultar: (pacienteId) => request(`/api/pacientes/${pacienteId}/plano`),
};

export const coberturaApi = {
  validar: (paciente, procedimento) =>
    request(
      `/api/cobertura?paciente=${paciente}&procedimento=${encodeURIComponent(
        procedimento
      )}`
    ),
};
