package com.bolsadeideas.springbootbackendapirest.models.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.bolsadeideas.springbootbackendapirest.models.entity.Persona;

public interface IPersonaRepository extends JpaRepository<Persona, Long>{

}