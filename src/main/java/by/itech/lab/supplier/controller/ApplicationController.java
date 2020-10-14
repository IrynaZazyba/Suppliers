package by.itech.lab.supplier.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static by.itech.lab.supplier.constant.ApiConstants.URL_APPLICATION;

@RestController
@AllArgsConstructor
@RequestMapping(URL_APPLICATION)
public class ApplicationController {
}
