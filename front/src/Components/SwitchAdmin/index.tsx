import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Form, FormGroup, Input } from "reactstrap"
import api from "../../api/api"
import { enumTypeNotification, useNotification } from "../../Context/Notification"
import { IUsuario } from "../../Pages/Usuarios"
import { useToken } from "../../Hooks/useToken"

interface IAlterarPermissaoDTO {
    novaPermissao: string
}

interface IBodyPermission {
    id: string
    newRole: string
}

export function SwitchAdmin({role, id}:{role:string, id:string}){
    const {notify} = useNotification()
    const queryClient = useQueryClient();
    const { decoded } = useToken()

    function atualizarPerfilNatela(bodyPermission:IBodyPermission){
        queryClient.setQueryData(['usuarios'],(prev:Array<IUsuario>)=>{
            return prev.map((usuario:IUsuario)=>{
                if(usuario._id !== bodyPermission.id){
                    return usuario
                }

                return {
                    ...usuario,
                    role: bodyPermission.newRole
                }
            })
        })
    }

    async function alterarPermissao(newRole: string,id:string){
        const AlterarPermissaoDTO: IAlterarPermissaoDTO = {novaPermissao: newRole}        
        const promise = api.patch(`/user/alterarpermissao/${id}`,AlterarPermissaoDTO)
        notify(enumTypeNotification.PROMISE,`Alterando Permissão do usuário de id: ${id}`,promise)
        const res = await promise
        return res.data
    }

    const mutation = useMutation({
        mutationFn: async (BodyPermission: IBodyPermission)=>alterarPermissao(BodyPermission.newRole,BodyPermission.id),
        onSuccess: async (ok:any,variables:IBodyPermission) =>{
            notify(enumTypeNotification.SUCCESS,ok.message)
            atualizarPerfilNatela(variables)
        },
        onError: async (error:any)=>{
            notify(enumTypeNotification.ERROR, error.response.data.message)
        }
    })

    function handleAlterarPermissao(checked: boolean){
        const bodyPermission:IBodyPermission = {
            id: id,
            newRole: checked ? 'ADMIN' : 'USER'
        }
        mutation.mutate(bodyPermission)
    }

    return(
        <Form>
            <FormGroup switch>
                <Input 
                    type='switch' role='switch' checked={role === 'ADMIN'}
                    onChange={(event)=>handleAlterarPermissao(event.target.checked)}
                    disabled={decoded?._id === id}
                />                    
            </FormGroup>
        </Form>
    )
}