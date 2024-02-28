package com.user.Config;

import java.util.Arrays;
import java.util.Collections;

import javax.crypto.SecretKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
@Configuration
public class ApplicationConfiguration 
{
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http)throws Exception
	{
		http.sessionManagement(
				managment->managment.sessionCreationPolicy
				(SessionCreationPolicy.STATELESS
						)
				).authorizeHttpRequests(
						Authorize->Authorize.requestMatchers("/api/**")
						.authenticated().
						anyRequest()
						.permitAll()
						)
		//.addFilterBefore(null , BasicAuthenticationFilter.class)
		
		.addFilterBefore(new JwtTokenValidator(), BasicAuthenticationFilter.class)
		.csrf(csrf->csrf.disable()).cors(cors->cors.configurationSource(corsConfigurationSource())).httpBasic(Customizer.withDefaults())
		.formLogin(Customizer.withDefaults());
		return http.build();
	}

	private CorsConfigurationSource corsConfigurationSource() {
		
		return new CorsConfigurationSource()
				{

					@Override
					public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
						CorsConfiguration cfg=new CorsConfiguration();
						cfg.setAllowedOrigins(Collections.singletonList("*"));
						cfg.setAllowedMethods(Collections.singletonList("*"));
						cfg.setAllowCredentials(true);
						cfg.setAllowedHeaders(Collections.singletonList("*"));
						cfg.setExposedHeaders(Arrays.asList("Authorization"));
						cfg.setMaxAge(3600L);
						
						return cfg;
					}
			
			
				};
	}
	@Bean
	public PasswordEncoder passwordEncoder()
	{
		return new BCryptPasswordEncoder();
	}
	@Bean
    public SecretKey secretKey()
	{
	
       return Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);
    }
}
