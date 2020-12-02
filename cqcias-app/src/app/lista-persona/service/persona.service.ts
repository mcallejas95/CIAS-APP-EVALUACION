import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Persona } from './persona.model';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private urlEndPoint: string = 'http://localhost:8080/api/personas';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })

  constructor(private http: HttpClient) { }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.urlEndPoint).pipe(
      map(response => response as Persona[])
    );
  }

  getPersonasPaginado(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
        (response.content as Persona[]).forEach(cliente => console.log(cliente.nombre));
      }),
      map((response: any) => {
        (response.content as Persona[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Persona[]).forEach(cliente => console.log(cliente.nombre));
      })
    );
  }

  createPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.urlEndPoint, persona, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal({
          position: 'top-end',
          type: 'warning',
          title: 'Error al guardar la persona: ' + e.error.Mensaje + ' error ',
          showConfirmButton: false,
          timer: 3000
        });
        return throwError(e);
      })
    )
  }

  getPersona(id): Observable<Persona> {
    return this.http.get<Persona>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        swal({
          position: 'top-end',
          type: 'warning',
          title: 'Error al obtener la persona: ' + e.error.Mensaje + ' error ',
          showConfirmButton: false,
          timer: 3000
        });
        return throwError(e);
      })
    )
  }

  updatePrsona(persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.urlEndPoint}/${persona.id}`, persona, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal({
          position: 'top-end',
          type: 'warning',
          title: 'Error al actualizar la persona: ' + e.error.Mensaje + ' error ',
          showConfirmButton: false,
          timer: 3000
        });
        return throwError(e);
      })
    )
  }

  deletePersona(id: number): Observable<Persona> {
    return this.http.delete<Persona>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        swal({
          position: 'top-end',
          type: 'warning',
          title: 'Error al eliminar la persona: ' + e.error.Mensaje + ' error ',
          showConfirmButton: false,
          timer: 3000
        });
        return throwError(e);
      })
    )
  }
}
