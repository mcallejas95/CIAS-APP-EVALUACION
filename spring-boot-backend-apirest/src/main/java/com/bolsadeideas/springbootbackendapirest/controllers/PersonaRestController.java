package com.bolsadeideas.springbootbackendapirest.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bolsadeideas.springbootbackendapirest.models.entity.Persona;
import com.bolsadeideas.springbootbackendapirest.models.services.IPersonaService;

@CrossOrigin(origins = { "http://localhost:4200" })
@RestController
@RequestMapping("/api")
public class PersonaRestController {

	@Autowired
	private IPersonaService personaService;

	@GetMapping("/personas")
	public List<Persona> findAll() {
		return personaService.findAll();
	}
	
	@GetMapping("/personas/page/{page}")
	public Page<Persona> index(@PathVariable Integer page) {
		return personaService.findAll(PageRequest.of(page, 3));
	}

	@GetMapping("/personas/{id}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> show(@PathVariable Long id) {
		Persona persona = personaService.findById(id);
		
		Map<String, Object> response = new HashMap<>();
		if (persona == null) {
			response.put("Mensaje", "La persona con el ID: "
					.concat(id.toString().concat(" no existe en la base de datos.")));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity(persona, HttpStatus.OK);
	}

	@PostMapping("/personas")
	public ResponseEntity<?> create(@RequestBody Persona persona) {
		Map<String, Object> response = new HashMap<>();
		Persona personaCreate = null;
		try {
			personaCreate = personaService.save(persona);
		} catch (DataAccessException e) {
			response.put("Mensaje", "Error al guardar en la base de datos");
			response.put("error", e.getMessage().concat(": ")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		response.put("Mensaje", "El registro ha sido creado con éxito");
		response.put("Persona", personaCreate);
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
	}

	@PutMapping("/personas/{id}")
	public ResponseEntity<?> update(@RequestBody Persona persona, @PathVariable Long id) {
		Persona personaActual = personaService.findById(id);
		Persona personaUpd = null;
		
		Map<String, Object> response = new HashMap<>();
		
		if (personaActual == null) {
			response.put("Mensaje", "Error: no se pudo editar, la persona con el ID "
					.concat(id.toString().concat(" no existe en la base de datos.")));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.NOT_FOUND);
		}
		try {
			personaActual.setNombre(persona.getNombre());
			personaActual.setPrimer_apellido(persona.getPrimer_apellido());
			personaActual.setSegundo_apellido(persona.getSegundo_apellido());
			personaActual.setTelefono(persona.getTelefono());
			personaActual.setEstatus(persona.getEstatus());
			
			personaUpd = personaService.save(personaActual);

		} catch (DataAccessException e) {
			response.put("Mensaje", "Error al actualizar en la base de datos");
			response.put("error", e.getMessage().concat(": ")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		response.put("Mensaje", "El registro ha sido actualizado con éxito");
		response.put("Persona", personaUpd);
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
	}

	@DeleteMapping("/personas/{id}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<?> delete(@PathVariable Long id) {
		Map<String, Object> response = new HashMap<>();
		try {
			 personaService.delete(id);
		} catch (DataAccessException e) {
			response.put("Mensaje", "Error al eliminar en la base de datos");
			response.put("error", e.getMessage().concat(": ")
					.concat(e.getMostSpecificCause().getMessage()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		response.put("Mensaje", "El registro ha sido eliminado con éxito");
		
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
	}
}
