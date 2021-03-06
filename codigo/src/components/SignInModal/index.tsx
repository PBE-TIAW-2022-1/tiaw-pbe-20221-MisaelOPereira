import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '../../hooks/useAuth';

import { Button } from '../Button';
import { Input } from '../Input';

import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';

import './styles.css';

interface ModalProps {
  onClose(): void;
}

interface SignInFormData {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string()
            .required('Informe o e-mail')
            .email('E-mail inválido'),
  password: yup.string()
            .required('Informe a senha')
});

export function SignInModal({ onClose }: ModalProps) {
  const {
    register,
    handleSubmit,
    formState
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
    shouldFocusError: false
  });

  const { signIn } = useAuth();

  const handleSignIn: SubmitHandler<SignInFormData> = async data => {
    try {
      await signIn(data);

      onClose();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message, {
          duration: 3000
        });
      }
    }
  }

  return (
    <div className="modal-bg" onMouseDown={onClose}>
      <div className="form-box" onMouseDown={e => e.stopPropagation()}>
        <button onClick={onClose}>
          <IoClose />
        </button>

        <h1 className="signin-title">Faça login em sua conta:</h1>

        <form
          className="signin-form"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Input
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            error={formState.errors.email}
            {...register('email')}
          />

          <Input
            type="password"
            placeholder="Senha"
            error={formState.errors.password}
            {...register('password')}
          />

          <Button type="submit">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}