import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PersonaService } from "./service/persona.service";
import { Persona } from "./service/persona.model";
import { isNullOrUndefined } from "util";
import { BsModalService, BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import swal from 'sweetalert2';
import { tap } from "rxjs/operators";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-lista-persona',
  templateUrl: './crud-persona.component.html',
  styleUrls: ['./crud-persona.component.css']
})
export class CrudPersonaComponent implements OnInit {
  @ViewChild('formPersona') personaRef: TemplateRef<any>;
  public personasList: Persona[];
  public persona: Persona = <Persona>{};
  public modalRef: BsModalRef
  public personaForm: FormGroup;
  public formEdit = false;
  public disableEditForm = true;
  paginador: any;

  constructor(private personaService: PersonaService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.personaForm = this.fb.group({
      formNombre: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      formPrimerApellido: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      formSegundoApellido: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      formTelefono: ['', Validators.compose([Validators.pattern('[0-9]{7,10}')])],
      formEstatus: ['']
    });
    this.loadPersonas();
  }

  openForm(template: TemplateRef<any>, edit: boolean) {
    this.toastr.success('El registro se guardo con satisfactoriamente.', 'send');
    if (edit) { this.formEdit = true; } else { this.formEdit = false; this.disableEditForm = false; }
    this.modalRef = this.modalService.show(template, { "ignoreBackdropClick": true });
  }

  cleanForm(): void {
    this.persona = {};
    this.personaForm.reset();
    this.modalRef.hide;
    this.modalService.hide(1);
    this.disableEditForm = true;
  }

  activarEdicion(): void {
    if (this.disableEditForm)
      this.toastr.info('Modo edición activado');
    this.disableEditForm = !this.disableEditForm;
  }

  loadPersonas() {
    this.personaService.getPersonas().subscribe(
      resp => { this.personasList = resp
      }
    );
  }

  public createPersona(): void {
    if (!this.personaForm.valid) {
      swal({
        position: 'top-end',
        type: 'warning',
        title: 'Por favor llene los campos requeridos.',
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      if (!isNullOrUndefined(this.persona.id)) {
        this.personaService.updatePrsona(this.persona)
          .subscribe(resp => {
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Registro actualizado con éxito!',
              showConfirmButton: false,
              timer: 500
            });
            this.cleanForm();
          })
      } else {
        this.personaService.createPersona(this.persona)
          .subscribe(resp => {
            swal({
              position: 'top-end',
              type: 'success',
              title: 'Registro creado con éxito!',
              showConfirmButton: false,
              timer: 500
            });
            this.personasList.push(this.persona);
            this.cleanForm();
          });
      }
    }
  }

  public obtPersona(persona: Persona): void {
    this.openForm(this.personaRef, true);
    this.personaService.getPersona(persona.id).subscribe((resp) => this.persona = resp)
  }

  confirmDelete(template: TemplateRef<any>, persona: Persona) {
    this.modalRef = this.modalService.show(template, { "ignoreBackdropClick": true });
    if (persona) {
      this.persona = persona;
    }
  }

  public delPersona() {
    this.personaService.deletePersona(this.persona.id).subscribe(
      response => {
        swal({
          position: 'top-end',
          type: 'success',
          title: 'Registro eliminado con exito',
          showConfirmButton: false,
          timer: 500
        });
        this.personasList = this.personasList.filter(cli => cli !== this.persona)
        this.cleanForm();
      }
    )
  }
}
