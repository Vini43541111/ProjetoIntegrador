import { useState, useEffect } from "react";
import { planosApi, vinculoApi } from "../services/api";

function NomePaciente({ paciente, erro }) {
  if (erro) return <p className="text-sm text-red-600">{erro}</p>;
  if (!paciente) return null;
  return (
    <div className="flex items-center gap-2 bg-brand-50 border border-brand-600 rounded-md px-3 py-2 text-sm text-brand-700">
      <span className="font-medium">✓ {paciente.nome}</span>
      <span className="text-slate-400">— ID {paciente.idpaciente}</span>
    </div>
  );
}

export default function Vinculo() {
  const [planos, setPlanos] = useState([]);

  // --- Vincular ---
  const [pacienteId, setPacienteId] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [erroBusca, setErroBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [planoId, setPlanoId] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);

  // --- Atualizar ---
  const [atualizaId, setAtualizaId] = useState("");
  const [pacienteAtualiza, setPacienteAtualiza] = useState(null);
  const [erroBuscaAtualiza, setErroBuscaAtualiza] = useState("");
  const [buscandoAtualiza, setBuscandoAtualiza] = useState(false);
  const [atualizaPlanoId, setAtualizaPlanoId] = useState("");
  const [atualizaResultado, setAtualizaResultado] = useState(null);
  const [atualizaErro, setAtualizaErro] = useState("");
  const [atualizando, setAtualizando] = useState(false);

  // --- Consultar ---
  const [consultaId, setConsultaId] = useState("");
  const [vinculoConsulta, setVinculoConsulta] = useState(null);
  const [erroConsulta, setErroConsulta] = useState("");

  useEffect(() => {
    planosApi
      .listar({ status: "ATIVO" })
      .then((r) => setPlanos(r.data || []))
      .catch(() => {});
  }, []);

  async function buscar(id, setPac, setErr, setLoad) {
    if (!id) return;
    setLoad(true);
    setErr("");
    setPac(null);
    try {
      const r = await vinculoApi.buscarPaciente(id);
      setPac(r.data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoad(false);
    }
  }

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

      {/* Vincular */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-brand-700 mb-1">
          Vincular paciente a plano
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Busque o paciente pelo ID para validar no G1 antes de vincular.
        </p>
        <form onSubmit={vincular} className="space-y-4">
          <div className="flex gap-2">
            <input
              className="border border-slate-300 rounded-md px-3 py-2 text-sm flex-1"
              placeholder="ID do paciente (G1)"
              value={pacienteId}
              onChange={(e) => { setPacienteId(e.target.value); setPaciente(null); setErroBusca(""); }}
              required
            />
            <button
              type="button"
              disabled={buscando || !pacienteId}
              onClick={() => buscar(pacienteId, setPaciente, setErroBusca, setBuscando)}
              className="bg-slate-100 border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-200 disabled:opacity-50"
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>

          <NomePaciente paciente={paciente} erro={erroBusca} />

          <select
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            value={planoId}
            onChange={(e) => setPlanoId(e.target.value)}
            required
          >
            <option value="">Selecione um plano ativo</option>
            {planos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          {erro && <p className="text-sm text-red-600">{erro}</p>}
          {resultado && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
              Vínculo criado com sucesso para{" "}
              <span className="font-semibold">
                {resultado.paciente?.nome ?? `paciente ${pacienteId}`}
              </span>.
            </div>
          )}

          <button
            type="submit"
            disabled={processando || !paciente}
            className="bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-800 disabled:opacity-50"
          >
            {processando ? "Vinculando..." : "Vincular"}
          </button>
        </form>
      </section>

      {/* Atualizar */}
      <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-brand-700 mb-1">
          Atualizar plano do paciente
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Encerra o vínculo atual e cria um novo com o plano selecionado.
        </p>
        <form onSubmit={atualizar} className="space-y-4">
          <div className="flex gap-2">
            <input
              className="border border-slate-300 rounded-md px-3 py-2 text-sm flex-1"
              placeholder="ID do paciente"
              value={atualizaId}
              onChange={(e) => { setAtualizaId(e.target.value); setPacienteAtualiza(null); setErroBuscaAtualiza(""); }}
              required
            />
            <button
              type="button"
              disabled={buscandoAtualiza || !atualizaId}
              onClick={() => buscar(atualizaId, setPacienteAtualiza, setErroBuscaAtualiza, setBuscandoAtualiza)}
              className="bg-slate-100 border border-slate-300 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-200 disabled:opacity-50"
            >
              {buscandoAtualiza ? "Buscando..." : "Buscar"}
            </button>
          </div>

          <NomePaciente paciente={pacienteAtualiza} erro={erroBuscaAtualiza} />

          <select
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
            value={atualizaPlanoId}
            onChange={(e) => setAtualizaPlanoId(e.target.value)}
            required
          >
            <option value="">Selecione o novo plano ativo</option>
            {planos.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          {atualizaErro && <p className="text-sm text-red-600">{atualizaErro}</p>}
          {atualizaResultado && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
              Plano de{" "}
              <span className="font-semibold">
                {pacienteAtualiza?.nome ?? `paciente ${atualizaId}`}
              </span>{" "}
              atualizado com sucesso. Novo vínculo desde {atualizaResultado.data_inicio}.
            </div>
          )}

          <button
            type="submit"
            disabled={atualizando || !pacienteAtualiza}
            className="bg-brand-700 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-800 disabled:opacity-50"
          >
            {atualizando ? "Atualizando..." : "Atualizar plano"}
          </button>
        </form>
      </section>

      {/* Consultar */}
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
          <div className="text-sm border border-slate-200 rounded-md p-4 space-y-1">
            {vinculoConsulta.paciente && (
              <p>
                <span className="text-slate-500">Paciente:</span>{" "}
                <span className="font-semibold text-brand-700">
                  {vinculoConsulta.paciente.nome}
                </span>
                <span className="text-slate-400 ml-1">
                  — ID {vinculoConsulta.paciente.idpaciente}
                </span>
              </p>
            )}
            <p>
              <span className="text-slate-500">Plano vinculado:</span>{" "}
              <span className="font-medium">{vinculoConsulta.plano?.nome}</span>
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
