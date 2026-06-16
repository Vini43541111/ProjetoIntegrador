import { useState, useEffect } from "react";
import { planosApi, vinculoApi } from "../services/api";

export default function Vinculo() {
  const [pacienteId, setPacienteId] = useState("");
  const [planoId, setPlanoId] = useState("");
  const [planos, setPlanos] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);

  const [consultaId, setConsultaId] = useState("");
  const [vinculoConsulta, setVinculoConsulta] = useState(null);
  const [erroConsulta, setErroConsulta] = useState("");

  const [atualizaId, setAtualizaId] = useState("");
  const [atualizaPlanoId, setAtualizaPlanoId] = useState("");
  const [atualizaResultado, setAtualizaResultado] = useState(null);
  const [atualizaErro, setAtualizaErro] = useState("");
  const [atualizando, setAtualizando] = useState(false);

  useEffect(() => {
    planosApi
      .listar({ status: "ATIVO" })
      .then((r) => setPlanos(r.data || []))
      .catch(() => {});
  }, []);

  async function vincular(e) {
    e.preventDefault();
    setProcessando(true);
    setErro("");
    setResultado(null);
    try {
      const r = await vinculoApi.vincular(pacienteId, Number(planoId));
      setResultado(r.data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setProcessando(false);
    }
  }

  async function atualizar(e) {
    e.preventDefault();
    setAtualizando(true);
    setAtualizaErro("");
    setAtualizaResultado(null);
    try {
      const r = await vinculoApi.atualizar(atualizaId, Number(atualizaPlanoId));
      setAtualizaResultado(r.data);
    } catch (e) {
      setAtualizaErro(e.message);
    } finally {
      setAtualizando(false);
    }
  }

  async function consultar(e) {
    e.preventDefault();
    setErroConsulta("");
    setVinculoConsulta(null);
    try {
      const r = await vinculoApi.consultar(consultaId);
      setVinculoConsulta(r.data);
    } catch (e) {
      setErroConsulta(e.message);
    }
  }

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-brand-700 mb-1">
          Vincular paciente a plano
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          O paciente é validado no módulo de Pacientes (G1) antes do vínculo.
        </p>
        <form onSubmit={vincular} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-slate-300 rounded-md px-3 py-2 text-sm"
              placeholder="ID do paciente (G1)"
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              required
            />
            <select
              className="border border-slate-300 rounded-md px-3 py-2 text-sm"
              value={planoId}
              onChange={(e) => setPlanoId(e.target.value)}
              required
            >
              <option value="">Selecione um plano ativo</option>
              {planos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}
          {resultado && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
              Vínculo criado com sucesso
              {resultado.paciente ? ` para ${resultado.paciente.nome}` : ""}.
            </div>
          )}

          <button
            type="submit"
            disabled={processando}
            className="bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-800 disabled:opacity-50"
          >
            {processando ? "Vinculando..." : "Vincular"}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-brand-700 mb-1">
          Atualizar plano do paciente
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Encerra o vínculo atual e cria um novo com o plano selecionado.
        </p>
        <form onSubmit={atualizar} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border border-slate-300 rounded-md px-3 py-2 text-sm"
              placeholder="ID do paciente"
              value={atualizaId}
              onChange={(e) => setAtualizaId(e.target.value)}
              required
            />
            <select
              className="border border-slate-300 rounded-md px-3 py-2 text-sm"
              value={atualizaPlanoId}
              onChange={(e) => setAtualizaPlanoId(e.target.value)}
              required
            >
              <option value="">Selecione o novo plano ativo</option>
              {planos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          {atualizaErro && (
            <p className="text-sm text-red-600">{atualizaErro}</p>
          )}
          {atualizaResultado && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
              Plano atualizado com sucesso. Novo vínculo criado em{" "}
              {atualizaResultado.data_inicio}.
            </div>
          )}

          <button
            type="submit"
            disabled={atualizando}
            className="bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-800 disabled:opacity-50"
          >
            {atualizando ? "Atualizando..." : "Atualizar plano"}
          </button>
        </form>
      </section>

      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-brand-700 mb-4">
          Consultar vínculo de um paciente
        </h2>
        <form onSubmit={consultar} className="flex gap-3 mb-4">
          <input
            className="border border-slate-300 rounded-md px-3 py-2 text-sm flex-1"
            placeholder="ID do paciente"
            value={consultaId}
            onChange={(e) => setConsultaId(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-700"
          >
            Consultar
          </button>
        </form>

        {erroConsulta && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
            {erroConsulta}
          </p>
        )}
        {vinculoConsulta && (
          <div className="text-sm border border-slate-200 rounded-md p-4">
            <p>
              <span className="text-slate-500">Plano vinculado:</span>{" "}
              <span className="font-medium">
                {vinculoConsulta.plano?.nome}
              </span>
            </p>
            <p>
              <span className="text-slate-500">Início:</span>{" "}
              {vinculoConsulta.data_inicio}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
