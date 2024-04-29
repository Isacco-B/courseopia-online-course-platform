/* eslint-disable react/prop-types */
import { FormInputOTP } from "@/components/FormInputOTP";
import {
  useConfirmAccountVerificationMutation,
  useGetAccountVerificationQuery,
} from "../api/authApiSlice";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

export default function AccountVerificationForm({ onSuccess }) {
  const { id } = useAuth();
  const [value, setValue] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { isLoading, refetch } = useGetAccountVerificationQuery(id);
  const [confirmAccountVerification, { isLoading: isLoadingAccount }] =
    useConfirmAccountVerificationMutation();
  const { toast } = useToast();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmAccountVerification({
        userId: id,
        data: { token: value },
      }).unwrap();
      onSuccess();
      toast({
        title: "Success!",
        description: "You have successfully verified your account.",
      });
    } catch (error) {
      console.log(error);
      setErrorMessage("Errore durante la verifica dell'account");
    }
  };

  const handleResendCode = async () => {
    try {
      await refetch();
      setSuccessMessage("Codice inviato");
    } catch (error) {
      console.log(error);
      setErrorMessage("Errore durante l'invio del codice");
    }
  };

  return (
    <div className="flex flex-col items-center justcy-center gap-3">
      <form className="flex flex-col items-center gap-2 sm:flex-row">
        <FormInputOTP value={value} onChange={(value) => setValue(value)} />
        <Button
          type="submit"
          disabled={isLoading || isLoadingAccount || value === ""}
          onClick={handleSubmit}
        >
          Verifica
        </Button>
      </form>

      <div className="text-center text-sm">
        {value === "" ? (
          <>Inserisci il codice che ti abbiamo inviato.</>
        ) : (
          <>Codice: {value}</>
        )}
      </div>
      <div className="text-center text-sm">
        <p>
          Non hai ricevuto il codice? clicca{" "}
          <span
            className="text-primary font-semibold underline hover:cursor-pointer"
            onClick={handleResendCode}
          >
            qui
          </span>{" "}
          per inviarlo
        </p>
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
}
