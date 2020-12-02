package com.bolsadeideas.springbootbackendapirest.models.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bolsadeideas.springbootbackendapirest.models.dao.IPersonaRepository;
import com.bolsadeideas.springbootbackendapirest.models.entity.Persona;

@Service
public class PersonaServiceImpl implements IPersonaService {

	@Autowired
	private IPersonaRepository personaRepository;

	
	@Override
	@Transactional(readOnly = true)
	public List<Persona> findAll() {
		return (List<Persona>) personaRepository.findAll();
	}
	
	@Override
	@Transactional(readOnly = true)
	public Page<Persona> findAll(Pageable pageable) {
		return personaRepository.findAll(pageable);
	}

	@Override
	@Transactional(readOnly = true)
	public Persona findById(Long id) {
		return personaRepository.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public Persona save(Persona persona) {
		return personaRepository.save(persona);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		personaRepository.deleteById(id);
	}

}
