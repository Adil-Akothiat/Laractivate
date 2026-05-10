import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "../../../../../components";

type StepSuccessProps = {
  closeHandler:()=>void;
//   userId:string|null;
}
const StepSuccess = ({ closeHandler }:StepSuccessProps) => {
   
    return (
        <div className="flex flex-col items-center text-center gap-5">
            <div className="bg-success/10 text-success rounded-full p-5">
                <CheckCircle2 size={36} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-base-content">
                    Two-Factor Authentication Enabled
                </h2>
                <p className="text-sm text-base-content/50 mt-1 max-w-sm">
                    Your account is now protected with two-factor
                    authentication. You'll be asked for a verification code each
                    time you sign in.
                </p>
            </div>
            <div className="badge badge-success gap-1 px-4 py-3 text-sm">
                <ShieldCheck size={14} /> Active
            </div>
            <Button variant='neutral' className="w-full" onClick={closeHandler}>Close</Button>
        </div>
    );
};

export default StepSuccess;