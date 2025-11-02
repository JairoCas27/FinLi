package com.finli.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class ConfiguracionSeguridad extends WebSecurityConfigurerAdapter {
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// Configuración mínima para permitir llamadas desde el frontend mientras no haya auth completa.
		http.cors().and().csrf().disable()
			.authorizeRequests()
			.antMatchers("/api/**", "/public/**").permitAll()
			.anyRequest().authenticated();
	}
}
