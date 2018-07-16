package com.tindung.jhip.service.impl;

import com.tindung.jhip.service.ThuChiService;
import com.tindung.jhip.domain.ThuChi;
import com.tindung.jhip.repository.ThuChiRepository;
import com.tindung.jhip.service.CuaHangService;
import com.tindung.jhip.service.dto.ThuChiDTO;
import com.tindung.jhip.service.mapper.ThuChiMapper;
import java.time.ZonedDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing ThuChi.
 */
@Service
@Transactional
public class ThuChiServiceImpl implements ThuChiService {

    private final Logger log = LoggerFactory.getLogger(ThuChiServiceImpl.class);

    private final ThuChiRepository thuChiRepository;

    private final ThuChiMapper thuChiMapper;
    private final CuaHangService cuaHangService;

    public ThuChiServiceImpl(ThuChiRepository thuChiRepository, ThuChiMapper thuChiMapper, CuaHangService cuaHangService) {
        this.thuChiRepository = thuChiRepository;
        this.thuChiMapper = thuChiMapper;
        this.cuaHangService = cuaHangService;
    }

    /**
     * Save a thuChi.
     *
     * @param thuChiDTO the entity to save
     * @return the persisted entity
     */
    @Override
    public ThuChiDTO save(ThuChiDTO thuChiDTO) {
        log.debug("Request to save ThuChi : {}", thuChiDTO);
        if (thuChiDTO.getId() == null) {//them moi
            thuChiDTO.setThoigian(ZonedDateTime.now());
            thuChiDTO.setCuaHangId(cuaHangService.findIDByUserLogin());
            ThuChi thuChi = thuChiMapper.toEntity(thuChiDTO);
//            thuChi.setThoigian(ZonedDateTime.now());
            thuChi = thuChiRepository.save(thuChi);
            return thuChiMapper.toDto(thuChi);

        }
        throw new InternalError("Khong sua duoc thu chi");

    }

    /**
     * Get all the thuChis.
     *
     * @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public List<ThuChiDTO> findAll() {
        log.debug("Request to get all ThuChis");
        return thuChiRepository.findAll().stream()
                .map(thuChiMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one thuChi by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public ThuChiDTO findOne(Long id) {
        log.debug("Request to get ThuChi : {}", id);
        ThuChi thuChi = thuChiRepository.findOne(id);
        return thuChiMapper.toDto(thuChi);
    }

    /**
     * Delete the thuChi by id.
     *
     * @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ThuChi : {}", id);
        thuChiRepository.delete(id);
    }
}
