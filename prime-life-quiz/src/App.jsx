import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { CheckCircle2, Users, Crown, Shield, Plus, Trash2 } from 'lucide-react';
import logo from './assets/logo.png';
import './App.css';

const plans = [
  {
    id: 'basico',
    name: 'Básico',
    icon: Shield,
    price: 'R$ 59,90',
    description: 'Plano individual para você',
    features: ['Consultas ilimitadas', 'Exames básicos', 'Telemedicina 24h', 'Rede credenciada'],
    dependents: 0,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'intermediario',
    name: 'Intermediário',
    icon: Users,
    price: 'R$ 69,90',
    description: '1 titular + até 3 dependentes',
    features: ['Tudo do Básico', 'Exames avançados', 'Urgência e emergência', 'Cobertura nacional'],
    dependents: 3,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Crown,
    price: 'R$ 89,90',
    description: '1 titular + até 4 dependentes',
    features: ['Tudo do Intermediário', 'Internações', 'Cirurgias', 'Cobertura internacional'],
    dependents: 4,
    color: 'from-pink-500 to-pink-600'
  }
];

const STORAGE_KEY = 'primelife_quiz_state';

const HomePage = ({ onStart }) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="text-center text-primary space-y-8 max-w-2xl animate-fade-in">
      <img src={logo} alt="Prime Life" className="w-32 h-32 mx-auto drop-shadow-2xl" />
      <h1 className="text-5xl md:text-6xl font-bold">Bem-vindo à Prime Life</h1>
      <p className="text-xl md:text-2xl opacity-90">
        O plano de saúde ideal para você e sua família
      </p>
      <Button 
        size="lg" 
        className="bg-white text-pink-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-full shadow-2xl"
        onClick={onStart}
      >
        Começar Agora
      </Button>
    </div>
  </div>
);

const PlansPage = ({ onPlanSelect }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <img src={logo} alt="Prime Life" className="w-20 h-20 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Escolha seu Plano</h2>
        <p className="text-gray-600 text-lg">Selecione o plano que melhor atende suas necessidades</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={plan.id} 
              className="plan-card cursor-pointer hover:shadow-2xl border-2 hover:border-pink-500"
              onClick={() => onPlanSelect(plan)}
            >
              <CardHeader className={`bg-gradient-to-r ${plan.color} text-white rounded-t-lg`}>
                <Icon className="w-12 h-12 mb-2" />
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-white/90 text-base">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-gray-800 mb-4">{plan.price}</div>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
                  Selecionar Plano
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  </div>
);

const FormSection = ({ personType, index, data, handleInputChange, errors, onRemove, canRemove }) => {
  const prefix = personType === 'titular' ? 'titular' : `dep${index}`;
  const title = personType === 'titular' ? 'Dados do Titular' : `Dados do Dependente ${index + 1}`;

  return (
    <Card className="shadow-xl mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-black">{title}</CardTitle>
        {canRemove && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Remover
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`${prefix}Nome`} className="text-black">Nome Completo *</Label>
          <Input
            id={`${prefix}Nome`}
            value={data.nome}
            onChange={(e) => handleInputChange(personType, index, 'nome', e.target.value)}
            className={errors[`${prefix}Nome`] ? 'border-red-500' : ''}
          />
          {errors[`${prefix}Nome`] && <p className="text-red-500 text-sm mt-1">{errors[`${prefix}Nome`]}</p>}
        </div>

        <div>
          <Label htmlFor={`${prefix}DataNascimento`} className="text-black">Data de Nascimento *</Label>
          <Input
            id={`${prefix}DataNascimento`}
            placeholder="DD/MM/AAAA"
            maxLength={10}
            value={data.dataNascimento}
            onChange={(e) => handleInputChange(personType, index, 'dataNascimento', e.target.value)}
            className={errors[`${prefix}DataNascimento`] ? 'border-red-500' : ''}
          />
          {errors[`${prefix}DataNascimento`] && <p className="text-red-500 text-sm mt-1">{errors[`${prefix}DataNascimento`]}</p>}
        </div>

        <div>
          <Label htmlFor={`${prefix}Cpf`} className="text-black">CPF *</Label>
          <Input
            id={`${prefix}Cpf`}
            placeholder="000.000.000-00"
            maxLength={14}
            value={data.cpf}
            onChange={(e) => handleInputChange(personType, index, 'cpf', e.target.value)}
            className={errors[`${prefix}Cpf`] ? 'border-red-500' : ''}
          />
          {errors[`${prefix}Cpf`] && <p className="text-red-500 text-sm mt-1">{errors[`${prefix}Cpf`]}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`${prefix}Cep`} className="text-black">CEP *</Label>
            <Input
              id={`${prefix}Cep`}
              placeholder="00000-000"
              maxLength={9}
              value={data.cep}
              onChange={(e) => handleInputChange(personType, index, 'cep', e.target.value)}
              className={errors[`${prefix}Cep`] ? 'border-red-500' : ''}
            />
            {errors[`${prefix}Cep`] && <p className="text-red-500 text-sm mt-1">{errors[`${prefix}Cep`]}</p>}
          </div>

          <div>
            <Label htmlFor={`${prefix}Numero`} className="text-black">Nº da Residência *</Label>
            <Input
              id={`${prefix}Numero`}
              value={data.numero}
              onChange={(e) => handleInputChange(personType, index, 'numero', e.target.value)}
              className={errors[`${prefix}Numero`] ? 'border-red-500' : ''}
            />
            {errors[`${prefix}Numero`] && <p className="text-red-500 text-sm mt-1">{errors[`${prefix}Numero`]}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FormPage = ({ selectedPlan, formData, handleInputChange, errors, onBack, onSubmit, onAddDependent, onRemoveDependent }) => {
  const canAddMore = formData.dependentes.length < selectedPlan.dependents;
  const hasDependents = selectedPlan.dependents > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img src={logo} alt="Prime Life" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Dados do Contrato</h2>
          <p className="text-gray-600">
            Plano selecionado: <span className="font-semibold text-pink-600">{selectedPlan?.name}</span>
          </p>
          {hasDependents && (
            <p className="text-gray-500 text-sm mt-2">
              Dependentes: {formData.dependentes.length} de {selectedPlan.dependents} permitidos
            </p>
          )}
        </div>

        <FormSection 
          personType="titular" 
          data={formData.titular} 
          handleInputChange={handleInputChange} 
          errors={errors}
          canRemove={false}
        />

        {formData.dependentes.map((dep, index) => (
          <FormSection 
            key={index} 
            personType="dependente" 
            index={index} 
            data={dep} 
            handleInputChange={handleInputChange} 
            errors={errors}
            canRemove={true}
            onRemove={() => onRemoveDependent(index)}
          />
        ))}

        {hasDependents && canAddMore && (
          <Card className="shadow-xl mt-6 border-2 border-dashed border-gray-300 hover:border-pink-500 transition-colors">
            <CardContent className="flex items-center justify-center py-8">
              <Button
                variant="outline"
                onClick={onAddDependent}
                className="flex items-center gap-2 text-pink-600 border-pink-600 hover:bg-pink-50"
              >
                <Plus className="w-5 h-5" />
                Adicionar Dependente
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button 
            onClick={onSubmit}
            className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

const ContractPage = ({ formData, selectedPlan, onBack, onSign }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState(null);

  const startDrawing = useCallback((e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      setSignature(canvas.toDataURL());
    }
  }, [isDrawing]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  }, []);

  const handleSign = () => {
    if (!signature) {
      alert('Por favor, assine o contrato antes de continuar');
      return;
    }
    onSign();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img src={logo} alt="Prime Life" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Contrato de Adesão</h2>
          <p className="text-gray-600">Revise os dados e assine o contrato</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-black">Resumo do Contrato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-black">Plano Contratado</h3>
              <p className="text-gray-700">{selectedPlan.name} - {selectedPlan.price}/mês</p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-black">Titular</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                <p className="text-gray-700"><span className="font-medium">Nome:</span> {formData.titular.nome}</p>
                <p className="text-gray-700"><span className="font-medium">CPF:</span> {formData.titular.cpf}</p>
                <p className="text-gray-700"><span className="font-medium">Data de Nascimento:</span> {formData.titular.dataNascimento}</p>
                <p className="text-gray-700"><span className="font-medium">CEP:</span> {formData.titular.cep}</p>
                <p className="text-gray-700"><span className="font-medium">Nº Residência:</span> {formData.titular.numero}</p>
              </div>
            </div>

            {formData.dependentes.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 text-black">Dependentes</h3>
                {formData.dependentes.map((dep, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-1 mb-3">
                    <p className="font-medium text-gray-800">Dependente {index + 1}</p>
                    <p className="text-gray-700"><span className="font-medium">Nome:</span> {dep.nome}</p>
                    <p className="text-gray-700"><span className="font-medium">CPF:</span> {dep.cpf}</p>
                    <p className="text-gray-700"><span className="font-medium">Data de Nascimento:</span> {dep.dataNascimento}</p>
                    <p className="text-gray-700"><span className="font-medium">CEP:</span> {dep.cep}</p>
                    <p className="text-gray-700"><span className="font-medium">Nº Residência:</span> {dep.numero}</p>
                  </div>
                ))}
              </div>
            )}

            <div>
              <h3 className="font-semibold text-lg mb-2 text-black">Termos e Condições</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto text-sm text-gray-700">
                <p className="mb-2">
                  <strong>1. OBJETO DO CONTRATO:</strong> Este contrato tem por objeto a prestação de serviços de assistência à saúde pela Prime Life ao CONTRATANTE e seus dependentes, conforme plano selecionado.
                </p>
                <p className="mb-2">
                  <strong>2. COBERTURA:</strong> A cobertura assistencial está limitada às condições e procedimentos previstos no plano contratado, conforme especificações apresentadas.
                </p>
                <p className="mb-2">
                  <strong>3. CARÊNCIAS:</strong> Serão aplicados os prazos de carência conforme legislação vigente e regulamento do plano.
                </p>
                <p className="mb-2">
                  <strong>4. PAGAMENTO:</strong> O pagamento da mensalidade deverá ser efetuado até o dia 10 de cada mês, sob pena de suspensão dos serviços.
                </p>
                <p className="mb-2">
                  <strong>5. RESCISÃO:</strong> O contrato poderá ser rescindido por qualquer das partes mediante comunicação prévia de 30 dias.
                </p>
                <p>
                  <strong>6. ACEITAÇÃO:</strong> Ao assinar este contrato, o CONTRATANTE declara ter lido e concordado com todos os termos e condições aqui estabelecidos.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 text-black">Assinatura Digital</h3>
              <p className="text-sm text-gray-600 mb-2">Assine no campo abaixo:</p>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="w-full bg-white cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>
              <Button
                variant="outline"
                onClick={clearSignature}
                className="mt-2"
              >
                Limpar Assinatura
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button 
            onClick={handleSign}
            className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
          >
            Assinar e Continuar para Pagamento
          </Button>
        </div>
      </div>
    </div>
  );
};

function App() {
  // Carregar estado inicial do localStorage
  const loadState = useCallback(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Restaurar o plano selecionado a partir do ID
        if (parsed.selectedPlanId) {
          const plan = plans.find(p => p.id === parsed.selectedPlanId);
          return {
            currentPage: parsed.currentPage || 'home',
            selectedPlan: plan || null,
            formData: parsed.formData || {
              titular: { nome: '', dataNascimento: '', cpf: '', cep: '', numero: '' },
              dependentes: []
            }
          };
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estado:', error);
    }
    return {
      currentPage: 'home',
      selectedPlan: null,
      formData: {
        titular: { nome: '', dataNascimento: '', cpf: '', cep: '', numero: '' },
        dependentes: []
      }
    };
  }, []);

  const initialState = loadState();
  const [currentPage, setCurrentPage] = useState(initialState.currentPage);
  const [selectedPlan, setSelectedPlan] = useState(initialState.selectedPlan);
  const [formData, setFormData] = useState(initialState.formData);
  const [errors, setErrors] = useState({});
  const [checkoutUrl, setCheckoutUrl] = useState('https://checkout.exemplo.com');

  // Salvar estado no localStorage sempre que houver mudanças
  useEffect(() => {
    try {
      const stateToSave = {
        currentPage,
        selectedPlanId: selectedPlan?.id || null,
        formData
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  }, [currentPage, selectedPlan, formData]);

  const validateCPF = useCallback((cpf) => {
    cpf = cpf.replace(/[^\d]/g, '');
    if (cpf.length !== 11 || !/^[0-9]{11}$/.test(cpf)) return false;
    let sum = 0;
    let remainder;

    // Validação do primeiro dígito
    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    // Validação do segundo dígito
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }, []);

  const validateCEP = useCallback((cep) => {
    cep = cep.replace(/\D/g, "");
    return cep.length === 8 && /^\d{8}$/.test(cep);
  }, []);

  const validateDate = useCallback((date) => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(date)) return false;
    
    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    return dateObj.getFullYear() === year && 
           dateObj.getMonth() === month - 1 && 
           dateObj.getDate() === day &&
           year >= 1900 && dateObj <= new Date(); // Não permite datas futuras
           ;
  }, []);

  const formatCPF = useCallback((value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
  }, []);

  const formatCEP = useCallback((value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    return value;
  }, []);

  const formatDate = useCallback((value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    return value;
  }, []);

  const handlePlanSelect = useCallback((plan) => {
    setSelectedPlan(plan);
    setFormData({
      titular: { nome: '', dataNascimento: '', cpf: '', cep: '', numero: '' },
      dependentes: []
    });
    setCurrentPage('form');
  }, []);

  const handleInputChange = useCallback((type, index, field, value) => {
    let formattedValue = value;
    if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'cep') {
      formattedValue = formatCEP(value);
    } else if (field === 'dataNascimento') {
      formattedValue = formatDate(value);
    }

    if (type === 'titular') {
      setFormData(prev => ({
        ...prev,
        titular: { ...prev.titular, [field]: formattedValue }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dependentes: prev.dependentes.map((dep, i) => 
          i === index ? { ...dep, [field]: formattedValue } : dep
        )
      }));
    }
  }, [formatCPF, formatCEP, formatDate]);

  const handleAddDependent = useCallback(() => {
    if (formData.dependentes.length < selectedPlan.dependents) {
      setFormData(prev => ({
        ...prev,
        dependentes: [...prev.dependentes, { nome: '', dataNascimento: '', cpf: '', cep: '', numero: '' }]
      }));
    }
  }, [formData.dependentes.length, selectedPlan]);

  const handleRemoveDependent = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      dependentes: prev.dependentes.filter((_, i) => i !== index)
    }));
    
    // Limpar erros do dependente removido
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`dep${index}Nome`];
      delete newErrors[`dep${index}DataNascimento`];
      delete newErrors[`dep${index}Cpf`];
      delete newErrors[`dep${index}Cep`];
      delete newErrors[`dep${index}Numero`];
      return newErrors;
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validar titular
    if (!formData.titular.nome.trim()) newErrors.titularNome = 'Nome completo é obrigatório';
    if (!formData.titular.dataNascimento) {
      newErrors.titularDataNascimento = 'Data de nascimento é obrigatória';
    } else if (!validateDate(formData.titular.dataNascimento)) {
      newErrors.titularDataNascimento = 'Data inválida (use DD/MM/AAAA)';
    }
    if (!formData.titular.cpf) {
      newErrors.titularCpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.titular.cpf)) {
      newErrors.titularCpf = 'CPF inválido';
    }
    if (!formData.titular.cep) {
      newErrors.titularCep = 'CEP é obrigatório';
    } else if (!validateCEP(formData.titular.cep)) {
      newErrors.titularCep = 'CEP inválido (8 dígitos)';
    }
    if (!formData.titular.numero.trim()) newErrors.titularNumero = 'Número da residência é obrigatório';

    // Validar dependentes
    formData.dependentes.forEach((dep, index) => {
      if (!dep.nome.trim()) newErrors[`dep${index}Nome`] = 'Nome completo é obrigatório';
      if (!dep.dataNascimento) {
        newErrors[`dep${index}DataNascimento`] = 'Data de nascimento é obrigatória';
      } else if (!validateDate(dep.dataNascimento)) {
        newErrors[`dep${index}DataNascimento`] = 'Data inválida (use DD/MM/AAAA)';
      }
      if (!dep.cpf) {
        newErrors[`dep${index}Cpf`] = 'CPF é obrigatório';
      } else if (!validateCPF(dep.cpf)) {
        newErrors[`dep${index}Cpf`] = 'CPF inválido';
      }
      if (!dep.cep) {
        newErrors[`dep${index}Cep`] = 'CEP é obrigatório';
      } else if (!validateCEP(dep.cep)) {
        newErrors[`dep${index}Cep`] = 'CEP inválido (8 dígitos)';
      }
      if (!dep.numero.trim()) newErrors[`dep${index}Numero`] = 'Número da residência é obrigatório';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateCPF, validateCEP, validateDate]);

  const handleFormSubmit = useCallback(() => {
    if (validateForm()) {
      setCurrentPage('contract');
    }
  }, [validateForm]);

  const handleContractSign = useCallback(() => {
    // Limpar localStorage antes de redirecionar para checkout
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = checkoutUrl;
  }, [checkoutUrl]);

  const renderPage = () => {
    switch (currentPage) {
      case 'plans':
        return <PlansPage onPlanSelect={handlePlanSelect} />;
      case 'form':
        return <FormPage 
          selectedPlan={selectedPlan} 
          formData={formData} 
          handleInputChange={handleInputChange} 
          errors={errors} 
          onBack={() => setCurrentPage('plans')} 
          onSubmit={handleFormSubmit}
          onAddDependent={handleAddDependent}
          onRemoveDependent={handleRemoveDependent}
        />;
      case 'contract':
        return <ContractPage 
          formData={formData} 
          selectedPlan={selectedPlan} 
          onBack={() => setCurrentPage('form')} 
          onSign={handleContractSign} 
        />;
      case 'home':
      default:
        return <HomePage onStart={() => setCurrentPage('plans')} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
}

export default App;

